<?php

if (WP_DEBUG) {
  header('Access-Control-Allow-Origin: *');
}

define( 'WP_USE_THEMES', false );
require_once( '../../../wp-load.php' );

$skipPosts = [];

if( $_GET['skipPosts'] != '' ){
  $skipPosts = explode('|', $_GET['skipPosts']);
}

$numPosts = (isset($_GET['numPosts'])) ? $_GET['numPosts'] : 10;
$page = (isset($_GET['pageNumber'])) ? $_GET['pageNumber'] : 1;
$tag = (isset($_GET['tag'])) ? $_GET['tag'] : "";
$category = (isset($_GET['category'])) ? $_GET['category'] : "";
$catID = get_term_by('name', $category, 'category');
$catID = $catID->term_id;

$format = (isset($_GET['format'])) ? $_GET['format'] : '';

$queryArgs = array(
  'posts_per_page' => $numPosts,
  'paged'          => $page,
  'tag'            => $tag,
  'cat'            => $catID,
  'ignore_sticky_posts' => 1,
);

$sticky = get_option( 'sticky_posts' );
if($_GET['stickyPosts'] == true){
  $queryArgs['post__in']  = get_option( 'sticky_posts' );
}else{
/** Show sticky at normal query too **/
//  $skipPosts = array_merge($skipPosts, $sticky);
}
//print_r($skipPosts);
if (count($skipPosts) > 0)
{
   $queryArgs['post__not_in'] = $skipPosts;
}

query_posts($queryArgs);

$responseData = array();
if ( have_posts() ) : while ( have_posts() ) : the_post();
  if($format == 'json'){
    $mPost = array();
    $postID = get_the_ID();
    if (get_post_format() == '' || get_post_format() == image){
      $mPost = array(
        "title" => the_title('','',false),
        "url" => get_permalink($postID),
        "images" => array(
          "small" => get_the_post_thumbnail_url($postID, 'medium'),
          "medium" => get_the_post_thumbnail_url($postID, 'medium_large'),
          "large" => get_the_post_thumbnail_url($postID, 'large'),
          "full" => get_the_post_thumbnail_url($postID, 'full'),
        ),
      );
    }
//    if (get_post_format() == 'link'):
//    if (get_post_format() == 'video'): $post_meta = get_post_meta(get_the_ID());
//    if (get_post_format() == 'status'):
    $responseData[] = $mPost;
  }else{
?>

  <div id="post-<?php the_ID(); ?>" class="item <?php echo get_post_format() ? get_post_format() : 'standard' ; ?><?php

  foreach (get_the_tags() as $tag){
    echo ' ' . $tag->name;
  }
  ?>">
    <?php
    /**
     * Default post
     */
    if (get_post_format() == ''): ?>
      <a href="/tag/highlight"><div class="highlightlabel"> highlight</div></a>
      <a href="<?php echo get_post_permalink(); ?>">
        <div class="featuredImage">
          <?php the_post_thumbnail('medium_large'); ?>
        </div>
      </a>
      <h3><a href="<?php echo get_post_permalink(); ?>"><?php the_title(); ?></a></h3>
      <?php the_content(); ?>
      <div class="read_more">
        <a href="<?php echo get_post_permalink(); ?>">Read full story &rarr;</a>
      </div>
    <?php endif; ?>

    <?php
    /**
     * Post format link
     */
    if (get_post_format() == 'link'): ?>
    <a href="/tag/highlight"><div class="highlightlabel"> highlight</div></a>
      <?php the_content(); ?>

    <?php endif; ?>

    <?php
    /**
     * Post format video
     */
    if (get_post_format() == 'video'): $post_meta = get_post_meta(get_the_ID()); ?>
    <a href="/tag/highlight"><div class="highlightlabel"> highlight</div></a>
      <div class="video">
        <?php

        if ($post_meta['_youtube_video_url'][0] != ''){
          $video_url = $post_meta['_youtube_video_url'][0];
        }elseif ($post_meta['_vimeo_video_url'][0] != ''){
          $video_url = $post_meta['_vimeo_video_url'][0];
        }elseif ($post_meta['_vine_video_url'][0] != ''){
          $video_url = $post_meta['_vine_video_url'][0];
        }elseif ($post_meta['mega_youtube_vimeo_url'][0] != ''){
          $video_url = $post_meta['mega_youtube_vimeo_url'][0];
        }

        if (strpos($video_url, 'youtube')){
          parse_str(parse_url($video_url, PHP_URL_QUERY ), $querystring);
          if (isset($querystring['v'])){
            echo '<div class="youtube-container"><img class="youtube-placeholder" src="https://img.youtube.com/vi/' . $querystring['v'] . '/maxresdefault.jpg"><a href="' . $querystring['v'] . '"><img src="' . get_bloginfo('template_url') . '/img/youtube-style-play-button-md.png"></a></div>';
          }
        }
        if (strpos($video_url, 'vimeo')){
          $parts = explode('/', $video_url);
          $video_code = end($parts);
          $video_meta = json_decode(file_get_contents('http://vimeo.com/api/v2/video/' . $video_code . '.json'));
          $thumbnail = $video_meta[0]->thumbnail_large;
          echo '<div class="vimeo-container"><img class="vimeo-placeholder" src="' . $thumbnail . '"><a href="' . $video_code . '"><img src="' . get_bloginfo('template_url') . '/img/youtube-style-play-button-md.png"></a></div>';
        }
        if (strpos($video_url, 'vine')){
          $parts = explode('/', $video_url);
          $video_code = end($parts);
          echo '<div class="vine-container"><img src="'.get_vine_thumbnail($video_code).'"><a href="' . $video_code . '"><img src="' . get_bloginfo('template_url') . '/img/youtube-style-play-button-md.png"></a></div>';}?>
</div>
        <a href="<?php echo get_post_permalink(); ?>"> <h3><?php the_title(); ?></h3></a>
          <?php the_content();?>


    <?php endif; ?>

    <?php
    /**
     * Post format Status
     */
    if (get_post_format() == 'status'): ?>
    <a href="/tag/highlight"><div class="highlightlabel"> highlight</div></a>
      <a href="<?php echo get_post_permalink(); ?>">
        <div class="status">
        <div class="status-image">
        <div class="featuredImage">
          <?php the_post_thumbnail('medium_large'); ?>
        </div>

      <div class="status-text">
        <?php the_content(); ?>  </a>
        <?php edit_post_link(); ?>

        </div>
        </div>
        </div>
<?php  endif; ?>


    <?php
    /**
     * Post format Image
     */
    if (get_post_format() == 'image'): ?>
    <a href="/tag/highlight"><div class="highlightlabel"> highlight</div></a>
      <a href="<?php echo get_post_permalink(); ?>">
        <div class="featuredImage">
          <?php the_post_thumbnail('medium_large'); ?>
        </div>
      </a>
      <div class="shadow"></div>
      <h3><a href="<?php echo get_post_permalink(); ?>"><?php the_title(); ?></a></h3>
      <?php the_content(); ?>
    <?php endif; ?>
  <div class="post_meta">
    <div class="tags"> <?php
    if($catID!= ''){
      foreach (get_the_tags() as $tag){
        echo ' #' . $tag->name . ' ';
      }
    } else {
      foreach (get_the_tags() as $tag){
        echo ' <a href="/tag/' . $tag->name . '">#' . $tag->name . '</a>';
      }
    }
    ?></div>
  <div class="category-footer">
      <div class="date"> <?php the_time('F j, Y'); ?><br /></div>

 <?php if(function_exists('wp_ulike')) wp_ulike('get'); ?>
     <div class="commenticon">
       <a href="<?php comments_link(); ?>">
       <img src="<?php bloginfo( 'template_url' ); ?>/img/comment.png" alt="comments" height="23" width="23"><?php
   comments_popup_link( '', '1', '%', 'comments-link', '');?></p></a></div>

 </div>
     <?php edit_post_link(); ?>
    </div>
  </div>
<?php
  }
  endwhile;
  if($format == 'json'){
    echo json_encode($responseData);
  }
  endif; ?>

<?php wp_reset_query(); ?>
