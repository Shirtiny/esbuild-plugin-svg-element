/*
 * @Author: Shirtiny
 * @Date: 2021-12-10 16:44:05
 * @LastEditTime: 2021-12-16 23:45:26
 * @Description:
 */
import fs from "fs";
import path from "path";
import camelcase from "camelcase";

const upperFirst = (string = "") => {
  const first = string.charAt(0);
  return first.toUpperCase() + string.slice(1);
};

const pluginSvg = (options) => ({
  name: "svg-element",
  setup(build) {
    const {
      namespace = "",
      tag = false,
      jsx = false,
      jsxContainerTag = "span",
    } = options;

    const nsPrefix = "svg-element";

    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      if (!/\.el\.svg$/.test(args.path)) {
        return;
      }
      const elName = path.basename(args.path, ".el.svg");

      const fullElName = nsPrefix + namespace + "-" + elName;

      let contents = await fs.promises.readFile(args.path, "utf8");

      if (jsx) {
        contents = contents.replace("class", "className");
      }

      contents = jsx
        ? `
      export default function ${upperFirst(
        camelcase(fullElName),
      )}({className}) {
        return ${
          !jsxContainerTag
            ? contents
            : `<${jsxContainerTag} className={className}>${contents}</${jsxContainerTag}>`
        }
      }
        `
        : `
      class SvgElement extends HTMLElement {
        connectedCallback() {
          this.innerHTML = "${contents}";
        }
      }
      const tag = "${fullElName}"
      window.customElements.define(tag, SvgElement);
      export default ${tag ? "tag" : "document.createElement(tag)"};
    `;

      return { contents, loader: jsx ? "jsx" : "js" };
    });
  },
});

export default pluginSvg;
