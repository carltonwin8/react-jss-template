require("babel-register")({ presets: ["react"] });
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const jss = require("jss").default;
const preset = require("jss-preset-default").default;

jss.setup(preset());

const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const prettier = require("prettier");

const debounce = require("./debounce");

const cl = console.log;

const getDirs = baseDir => {
  try {
    const dir = path.join(__dirname, baseDir);
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const dirs = files
      .filter(file => file.isDirectory())
      .map(file => path.join(dir, file.name));
    return dirs;
  } catch (e) {
    console.error("Error in getDirs:", e);
    return [];
  }
};

const dirs = getDirs("../src");
const watcher = chokidar.watch(dirs, { ignored: /^\./, persistent: true });
watcher
  .on("add", fpth => cl("add", fpth) || debouncedGenerate())
  .on("change", fpth => cl("change", fpth) || debouncedGenerate())
  .on("unlink", fpth => cl("remove", fpth))
  .on("error", error => console.error("Error happened", error));

const templates = `../src/pages`;
const components = `../src/components`;

const getCss = (outDir, htmlStr) => {
  const stylesIn = path.join(__dirname, `../src/styles/index.js`);
  const stylesOut = path.join(outDir, `styles.css`);
  delete require.cache[require.resolve(stylesIn)];
  const styles = require(stylesIn);
  const ss = jss.createStyleSheet(styles);
  const css = ss.toString();
  fs.writeFileSync(stylesOut, css);
  const { classes } = ss.attach(); // classes accessed in the eval below
  const htmlCss = eval("`" + htmlStr + "`");
  return htmlCss;
};

const triggerWebpackServer = () => {
  const filename = path.join(__dirname, "../src/index.js");
  if (!fs.existsSync(filename)) {
    console.log("Error! File not found", filename);
    return;
  }
  const data = fs.readFileSync(filename);
  const index = data.indexOf("#");
  const number = (parseInt(data[index + 1]) + 1) % 10;
  const newData = `${data.slice(0, index + 1)}${number}${data.slice(
    index + 2
  )}`;
  fs.writeFileSync(filename, newData);
};

const genfile = file => {
  const page = require(path.join(__dirname, templates, file));
  const elements = React.createElement(page);
  const pageStr = ReactDOMServer.renderToStaticMarkup(elements);
  const pretty = prettier.format(pageStr, { parser: "babel" });
  const htmlStr = ("<!DOCTYPE html>\n" + pretty).replace("</html>;", "</html>");

  const outDir = path.join(__dirname, "../build");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  fs.writeFileSync(
    path.join(outDir, file.replace(".js", ".html")),
    getCss(outDir, htmlStr)
  );

  triggerWebpackServer();
  console.log(`Processed ${file}`);
};

const generate = () => {
  try {
    const componentFs = fs.readdirSync(path.join(__dirname, components));
    const files = fs.readdirSync(path.join(__dirname, templates));
    const pages = files.map(f => path.join(__dirname, templates, f));
    const comps = componentFs.map(c => path.join(__dirname, components, c));
    [...pages, ...comps].forEach(
      req => delete require.cache[require.resolve(req)]
    );
    files.forEach(file => genfile(file));
  } catch (e) {
    console.log(`Failed with`, e);
  }
};
const debouncedGenerate = debounce(generate, 1000);
