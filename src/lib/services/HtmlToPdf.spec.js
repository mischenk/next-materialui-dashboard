import suite from "baretest";
import code from "@hapi/code";
import { generatePdf } from "./HtmlToPdf.js";
import path from "path";
import fs from "fs-extra";
import __dirname from "../../../dirname.js";

const { expect } = code;
const HtmlToPdfTestSuite = suite("HtmlToPdf Test Suite");

const dummyHTML = `
<h1>Hello PDF World</h1>
<code>Generated at ${new Date().toISOString()} with Puppeteer</code>
<img src="https://miro.medium.com/max/580/0*jCOWhOlQgZmFy_e6.png" />
`;
const testFilePath = path.join(__dirname, "src/lib/services", "hello-world.pdf");

const returnABuffer = async () => {
	return await generatePdf(dummyHTML);
};
const writePdfToFile = async () => {
	return await generatePdf(dummyHTML, { path: testFilePath });
};

HtmlToPdfTestSuite.before(() => {
	// Erase the PDF test file generated by precedent tests
	fs.rmSync(testFilePath, { force: true });
});

HtmlToPdfTestSuite("Generating PDF into a Buffer", async () => {
	const buf = await returnABuffer();
	expect(buf).to.be.a.buffer();
});

HtmlToPdfTestSuite("Write PDF to a file", async () => {
	await writePdfToFile();
	expect(fs.existsSync(testFilePath)).to.be.true();
});

export default HtmlToPdfTestSuite;
