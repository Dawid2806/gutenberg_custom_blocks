const { registerBlockType } = wp.blocks;
const { InnerBlocks, RichText, InspectorControls, PanelColorSettings } =
	wp.blockEditor;
const { __ } = wp.i18n;
const { PanelBody, TextControl } = wp.components;
import "./style.scss";
import "./editor.scss";

registerBlockType("cgb/accordion", {
	title: __("Accordion", "cgb"),
	icon: "editor-justify",
	category: "layout",
	attributes: {
		title: {
			type: "string",
			source: "html",
			selector: ".accordion-title",
		},
		backgroundColor: {
			type: "string",
		},
	},
	edit: ({ attributes, setAttributes }) => {
		const { backgroundColor } = attributes;
		return (
			<div className="accordion" style={{ backgroundColor: backgroundColor }}>
				<InspectorControls>
					<PanelBody title={__("Content", "cgb")}>
						<TextControl
							label={__("Title", "cgb")}
							value={attributes.title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelBody>
					<PanelColorSettings
						title={__("Color Settings", "cgb")}
						initialOpen={false}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: (color) => setAttributes({ backgroundColor: color }),
								label: __("Background Color", "cgb"),
							},
						]}
					/>
				</InspectorControls>
				<RichText
					className="accordion-title"
					tagName="p"
					value={attributes.title}
					onChange={(title) => setAttributes({ title })}
					placeholder={__("Title", "cgb")}
				/>
				<div className="accordion-content">
					<InnerBlocks />
				</div>
			</div>
		);
	},
	save: ({ attributes }) => {
		return (
			<div
				className="accordion"
				style={{ backgroundColor: attributes.backgroundColor }}
			>
				<RichText.Content
					className="accordion-title"
					tagName="p"
					value={attributes.title}
				/>
				<div className="accordion-content">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
