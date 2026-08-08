(function () {
  "use strict";

  var state = { chapters: [], current: 1 };

  var $ = function (id) { return document.getElementById(id); };
  var reader = $("reader");
  var title = $("chapterTitle");
  var content = $("chapterContent");
  var list = $("chapterList");
  var totalCount = $("totalCount");
  var progress = $("progress");
  var prevBtn = $("prevBtn");
  var nextBtn = $("nextBtn");
  var pagerInfo = $("pagerInfo");
  var drawer = $("drawer");
  var mask = $("mask");

  /* ---------- 主题 ---------- */
  var theme = localStorage.getItem("lingxi_theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  $("themeBtn").textContent = theme === "dark" ? "☀" : "☾";
  $("themeBtn").addEventListener("click", function () {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lingxi_theme", theme);
    this.textContent = theme === "dark" ? "☀" : "☾";
  });

  /* ---------- 目录 ---------- */
  function openDrawer() { drawer.classList.add("open"); mask.classList.add("show"); }
  function closeDrawer() { drawer.classList.remove("open"); mask.classList.remove("show"); }
  $("menuBtn").addEventListener("click", openDrawer);
  mask.addEventListener("click", closeDrawer);
  $("brand").addEventListener("click", function (e) { e.preventDefault(); loadChapter(1); });

  /* ---------- 静态数据读取（GitHub Pages 版，无后端） ---------- */
  /* 自动识别部署路径：仓库子路径（/仓库名/）或根域名（/）均可，无需改代码 */
  var BASE = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");

  function fetchText(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
  }

  function buildList() {
    totalCount.textContent = state.chapters.length;
    list.innerHTML = "";
    state.chapters.forEach(function (c) {
      var a = document.createElement("a");
      a.textContent = "第" + c.id + "章 " + c.title;
      a.dataset.id = c.id;
      a.addEventListener("click", function () {
        loadChapter(c.id);
        closeDrawer();
      });
      list.appendChild(a);
    });
  }

  function renderListActive() {
    Array.prototype.forEach.call(list.querySelectorAll("a"), function (a) {
      a.classList.toggle("active", Number(a.dataset.id) === state.current);
    });
  }

  /* ---------- 正文渲染 ---------- */
  function renderText(text) {
    text = text.replace(/^\ufeff/, "").replace(/^#\s*第\d+章.*$/m, "");
    var html = "";
    text.split(/\n+/).forEach(function (p) {
      p = p.trim();
      if (!p) return;
      html += "<p>" + p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</p>";
    });
    content.innerHTML = html;
  }

  function loadChapter(id) {
    state.current = id;
    var idx = state.chapters.findIndex(function (c) { return c.id === id; });
    if (idx < 0) { title.textContent = "章节不存在"; return; }
    title.textContent = "加载中…";
    fetchText(BASE + state.chapters[idx].file).then(function (text) {
      var c = state.chapters[idx];
      title.textContent = "第" + c.id + "章 " + c.title;
      renderText(text);
      document.title = "第" + c.id + "章 " + c.title + " · 泠晞";
      prevBtn.disabled = idx <= 0;
      nextBtn.disabled = idx >= state.chapters.length - 1;
      pagerInfo.textContent = "第 " + (idx + 1) + " / " + state.chapters.length + " 章";
      progress.textContent = Math.round(((idx + 1) / state.chapters.length) * 100) + "%";
      renderListActive();
      window.scrollTo({ top: 0 });
      localStorage.setItem("lingxi_last", String(id));
    }).catch(function (err) {
      console.error("章节加载失败:", BASE + state.chapters[idx].file, err);
      title.textContent = "章节加载失败（F12 查看 Console）";
    });
  }

  prevBtn.addEventListener("click", function () {
    var idx = state.chapters.findIndex(function (c) { return c.id === state.current; });
    if (idx > 0) loadChapter(state.chapters[idx - 1].id);
  });
  nextBtn.addEventListener("click", function () {
    var idx = state.chapters.findIndex(function (c) { return c.id === state.current; });
    if (idx >= 0 && idx < state.chapters.length - 1) loadChapter(state.chapters[idx + 1].id);
  });

  /* ---------- 键盘翻页 ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { prevBtn.click(); }
    else if (e.key === "ArrowRight") { nextBtn.click(); }
    else if (e.key === "Escape") { closeDrawer(); }
  });

  /* ---------- 初始化 ---------- */
  fetchText(BASE + "/chapters.json").then(function (data) {
    state.chapters = (JSON.parse(data).chapters) || [];
    if (!state.chapters.length) {
      title.textContent = "没有找到章节";
      return;
    }
    buildList();
    var last = parseInt(localStorage.getItem("lingxi_last"), 10);
    var target = state.chapters.some(function (c) { return c.id === last; }) ? last : 1;
    loadChapter(target);
  }).catch(function (err) {
    console.error("chapters.json 加载失败:", BASE + "/chapters.json", err);
    title.textContent = "chapters.json 加载失败（F12 查看 Console）";
  });
})();