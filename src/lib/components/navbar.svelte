<nav>
  <div class="title">
    <h5>RSS Reader</h5>
    <button>+</button>
  </div>

  <ul>
    <li class="selected">All</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
    <li>Some Info</li>
  </ul>
</nav>

<style>
  nav {
    width: 30dvw;
    height: 100dvh;
    overflow: auto;
    color: var(--text);
    position: relative;
    background-color: var(--secondary);
  }

  .title {
    inset: 0;
    z-index: 999;
    display: flex;
    padding: 10px;
    position: sticky;
    align-items: center;
    font-weight: bolder;
    text-transform: uppercase;
    justify-content: space-between;
    background-color: var(--primary);
  }

  .title > button {
    padding: 10px;
    font-size: large;
    line-height: 1rem;
    border-radius: 5px;
    background-color: var(--accent);
  }

  ul li {
    z-index: 2;
    padding: 10px;
    position: relative;
    border-top: 2px solid var(--accent);
  }

  ul li::after {
    left: 0;
    width: 0;
    height: 0;
    bottom: 0;
    content: "";
    z-index: -1;
    position: absolute;
    background-color: var(--accent);
    transition:
      0.5s height ease-in-out,
      0.5s width ease-in-out;
  }

  ul li:hover::after {
    width: 100%;
    height: 100%;
  }

  ul > li.selected {
    background-color: var(--accent);
  }
</style>
