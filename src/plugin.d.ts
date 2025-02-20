declare module "esbuild-plugin-svg-element" {
  interface IOption {
    // enable jsx export, default : false
    jsx?: boolean;
    // svg jsx wrapper, default: "span", set false to only export svg, ignore this if use web-component
    jsxContainerTag?: string;

    // web-component name prefix, default "", -eg: <namespace-element></namespace-element>
    namespace?: string;
    // only export a tag name for web-component, default false
    tag?: boolean;
  }

  interface createPlugin {
    (option: IOption): any;
  }

  export default createPlugin;
}
