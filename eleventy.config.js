const { eleventyAlembic } = require("@openlab/alembic/11ty");

const markdown = require("markdown-it");
const markdownAnchor = require("markdown-it-anchor");

const today = new Date();

const md = markdown({
  html: true,
});
md.use(markdownAnchor);

const dateSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';

  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyAlembic, { useLabcoat: false });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "./assets/favicon": "/" });
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("friendlyDate", (value)=>{
    const fmt = new Intl.DateTimeFormat("en-gb", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    })
    return fmt.format(value)
  });  
  eleventyConfig.addFilter("availableTime", (value)=>{
    let thisTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.toString();

    const weekday = new Intl.DateTimeFormat("en-gb", {
      weekday: "short"
    });

    const dateNumber = new Intl.DateTimeFormat("en-gb", {
      day: "numeric"
    });

    const hours = new Intl.DateTimeFormat("en-gb", {
      hour: "numeric",
      minute: "numeric",
      timeZone: thisTimeZone
    });

    if (value.getDate() == today.getDate() && value.getMonth() == today.getMonth() && value.getYear() == today.getYear()) {
      return "Today at " + hours.format(value);
    }
    else {
      let dateDays = dateNumber.format(value);
      return weekday.format(value) + " " + dateDays + dateSuffix(dateDays) + " at " + hours.format(value);
    }    
  });
  eleventyConfig.addFilter("sortSnippetByDate", (value)=>{
    return value.sort((a,b) => {
      return a.data.dateRemove - b.data.dateRemove;
    })
  });
  eleventyConfig.addFilter("sortArticleByDate", (value)=>{
    return value.sort((a,b) => {
      return b.data.dateUpdated - a.data.dateUpdated;
    })
  });
  eleventyConfig.addFilter("checkSnippetPublishable", (value)=>{
    return value.filter(x => x.data.publish == true);
  });
  eleventyConfig.addFilter("checkArticlePublishable", (value)=>{
    return value.filter(x => x.data.publish == true);
  });
};