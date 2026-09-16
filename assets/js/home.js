import appConfig from "../config.js"

const userAuth = localStorage.getItem("auth");

const liveSnippetsHolder = document.getElementById("live-snippets-holder");
const completedSection = document.getElementById("completed-subsection");
const emptyNewNotice = document.getElementById("empty-new-notice");

const currrentTime = Date.now();

const endpoint = new URL("responses", appConfig.serverURL);
const responses = await fetch(endpoint, {
  method:"GET",
  headers: {
    Authorization: `Bearer ${userAuth}`
  }
});

let numCompleted = 0;
let completedIDs = [];
let toRemove = [];

const values = await responses.json();

for (var i = 0; i < values.length; i++) {
  if (values[i].token === userAuth) {
    completedIDs.push(values[i].data.id.toString());
  }
}

const liveSnippets = document.getElementsByClassName("live-snippet-box");

for (const snippet of liveSnippets) {
  const snippetID = snippet.id.toString();
  const datePublish = Date.parse(document.getElementById("date-publish-" + snippetID).value);
  const dateRemove = Date.parse(document.getElementById("date-remove-" + snippetID).value);
  const completedSnippet = document.getElementById("completed-" + snippetID);
 
  if (completedIDs.includes(snippetID)) { 
    completedSnippet.style.display = "inline";
    toRemove.push(snippet);

    numCompleted += 1;
  }
  else if (datePublish < currrentTime && dateRemove > currrentTime) { 
    snippet.style.display = "flex";
    toRemove.push(completedSnippet);
  }
  else {
    toRemove.push(snippet);
    toRemove.push(completedSnippet);
  }
}

const articles = document.getElementsByClassName("topic-box");

for (const article of articles) {
  const articleID = article.id.toString();
  const datePublish = Date.parse(document.getElementById("topic-date-publish-" + articleID).value);
 
  if (datePublish < currrentTime) {
    article.style.display = "flex";
  }
  else {
    toRemove.push(article);
  }
}

for (let i = 0; i < toRemove.length; i++) {
  toRemove[i].remove();
}

if (numCompleted > 0) {
  completedSection.style.display = "inline";
}

if (liveSnippetsHolder.children.length == 0) {
  emptyNewNotice.style.display = "block";
}