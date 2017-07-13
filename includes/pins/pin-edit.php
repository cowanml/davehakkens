<?php

class ProcessPin {

  function __construct($request, $files, $userIsAdmin) {
    $this->request = $request;
    $this->userIsAdmin = $userIsAdmin;
    $this->recordId = $request['id'];
    $this->files = $files;
    $this->isCreate = empty($this->recordId);
  }

  function to_JSON($input) {
    return json_encode($input);
  }

  function get_columns() {
    return array(
      'name' => array('%s', true),
      'address' => array('%s', true),
      'filters' => array('%s', true, 'to_JSON'),
      'imgs' => array('%s', false, 'to_JSON'),
      'tags' => array('%s', false, 'to_JSON'),
      'status' => array('%s', false),
      'contact' => array('%s', false),
      'website' => array('%s', false)
    );
  }

  function get_record_by_id($recordId) {
    global $wpdb;
    return $wpdb->get_results('select ID, imgs, user_ID from pp_pins where ID = ' . $recordId);
  }

  function validate() {
    //make sure logged in
    if (!is_user_logged_in()) return false;

    //only admins can change records that aren't theirs
    if (!$this->userIsAdmin && !$this->isCreate) {
      $this->currentRecord = $this->get_record_by_id($this->recordId);
      if ($this->currentRecord->user_ID != get_current_user_id()) return false;
    }

    //ensure required fields are filled
    $columns = $this->get_columns();
    foreach ($columns as $key => $value) {
      if (empty($this->request[$key]) && $value[1]) return false;
    }

    return true;
  }

  function upsert_pin() {
    $this->upload_files();
    $this->generate_request();
    $this->run();
  }

  function upload_files() {
    $files = $this->files;
    $currentImages = $this->currentRecord->imgs;

    for ($i = 0; $i < 3; $i++) {
      $fileKey = 'image' . $i . '_file';

      if (!empty($files[$key])) {
        //kill current file
        if (!empty($currentImages[$i])) unlink($currentImages[$i][1]);

        //handle new file and push into position in array
        $upload = wp_handle_upload($files[$key], array('test_form' => false));
        if (!isset($upload['error']) && isset($upload['file'])) {
          $currentImages[$i] = array($upload['url'], $upload['file']);
        } else {
          throw new Exception('it all failed');
        }
      }
    }

    $this->imgs = $currentImages;
  }

  function generate_request() {
    $record = array();
    $formats = array();
    $request = $this->request;
    $request['imgs'] = $this->imgs;

    $columns = $this->get_columns();

    foreach ($columns as $key => $value) {
      if (!empty($request[$key])) {
        $record[$key] = empty($value[2])
          ? $request[$key]
          : $this->{$value[2]}($request[$key]);
        array_push($formats, $value[0]);
      }
    }

    //if you're not an admin, reset show_on_map to false (waiting approval)
    $record['show_on_map'] = $this->userIsAdmin && $request['show_on_map'] == '1';
    array_push($formats, '%d');

    $this->record = $record;
    $this->formats = $formats;
  }

  function run() {
    global $wpdb;

    $record = $this->record;
    $recordId = $this->recordId;
    $formats = $this->formats;

    $wpdb->show_errors();
    if ($this->isCreate) {
      //default user_ID to current user
      $record['user_ID'] = get_current_user_id();
      array_push($formats);

      $wpdb->insert(
        'pp_pins',
        $record,
        $formats
      );
    } else {
      $wpdb->update(
        'pp_pins',
        $record,
        array('ID' => $recordId),
        $formats,
        array('%d')
      );
    }
  }
}
?>
