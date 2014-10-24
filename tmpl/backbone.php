<?php
defined( 'WPINC' ) or die;
?>

<script id="tmpl-competition" type="text/html">
<b>{{data.name}}</b> showdown:

<div class="competitors-wrap"></div>
</script>

<script id="tmpl-competitor" type="text/html">
<b>{{data.name}}</b>

<div class="votes-wrap"></div>
</script>

<script id="tmpl-vote" type="text/html">
<li>{{data.name}}</li>
</script>
