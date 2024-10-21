<template>
  <div class="landing bg-dark">
    <header class="navbar">
      <a class="logo-header-link" href="#">
        <object id="logo" type="image/svg+xml" data="images/ambulate-logo-bindle.svg"></object><span class="app-name">Ambulate</span>
      </a>
      <ul class="nav-links">
        <li>
          <a href="/login" class="btn btn-success">Get started</a>
        </li>
        <li>
          <a href="/login" class="btn">Sign in</a>
        </li>
      </ul>
    </header>
    <article>
      <img class="showcase" src="images/showcase.gif" alt="Ambulate showcase slides" />
    </article>
    <footer>
      ambulate.app &copy; 2019 :: 
      <a href="mailto:hello@ambulate.app">Support</a>
    </footer>
  </div>
</template>

<script>
</script>

<style scoped>
header {
margin-bottom: 1em;
}
.logo-header-link {
color: white;
font-size: 2em;
}
article {
text-align: center;
}
footer {
color: white;
text-align: center;
margin: 1em 0 2em 0;
padding: 1em 0 1em 0;
}
footer a {
color: white;
}
.nav-links {
margin-bottom: 0;
}
.nav-links li {
list-style-type: none;
display: inline-block;
float: right;
}
.btn {
color: white;
}
.showcase {
border: solid 4px black;
}
</style>
