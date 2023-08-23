/**
 * TYPE=unit /bin/bash jest.sh --watchAll jasmine/lib/template.jasmine.unit.js
 * NODE_API_PORT=4273 /bin/bash jasmine/test.sh --env .env --test jasmine/lib/template.jasmine.unit.js
 */

import template from "./template.js";

const html = `
<body>    
    <script src="../jasmine/bundles/jasmine.js"></script>
<# for (let file of tests_list_paths) { #>  
        <script src="<#= file #>"></script>
<# } #>
    <script src="../jasmine/bundles/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
</body>
</html>
`;

describe("template.js", () => {
  it("html", (done) => {
    const tmp = template(html);

    const generated = tmp({ tests_list_paths: ["one.js", "two.js"] });

    // console.log(`>${generated}<`)

    const expected = `
<body>    
    <script src="../jasmine/bundles/jasmine.js"></script>
  
        <script src="one.js"></script>
  
        <script src="two.js"></script>

    <script src="../jasmine/bundles/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
</body>
</html>
`;

    expect(generated).toEqual(expected);
    // expect(generated).toMatchSnapshot(expected);

    done();
  });
});
