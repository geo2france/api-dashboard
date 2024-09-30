declare module "*.svg?react" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}