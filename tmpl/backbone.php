<?php
defined( 'WPINC' ) or die;
?>

<script id="tmpl-competition" type="text/html">
<h2>{{data.name}} showdown</h2>

<div class="competitors-wrap"></div>
</script>

<script id="tmpl-competitor" type="text/html">
<p><b>{{data.name}}</b></p>
<p><img src="{{data.img}}" /></p>

<ul class="votes"></ul>
</script>

<script id="tmpl-vote" type="text/html">{{data.name}}</script>
