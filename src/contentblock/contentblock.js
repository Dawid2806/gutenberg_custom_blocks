const { registerBlockType } = wp.blocks;
const { MediaUpload, InspectorControls, RichText } = wp.blockEditor;
const { Button, SelectControl } = wp.components;
import "./editor.scss";
import "./style.scss";
registerBlockType("cgb/contentblockk", {
	title: "Custom Group Block",
	icon: "welcome-add-page",
	category: "layout",
	attributes: {
		imgURL: {
			type: "string",
			default: "http://placehold.it/500",
		},
		imgID: {
			type: "number",
		},
		imgAlt: {
			type: "string",
			default: "",
		},
		title: {
			type: "string",
			source: "html",
			selector: "h3",
		},
		content: {
			type: "string",
			source: "html",
			selector: "p",
		},
		layout: {
			type: "string",
			default: "image-left",
		},
	},
	edit: (props) => {
		const {
			attributes: { imgID, imgURL, imgAlt, title, content, layout },
			setAttributes,
			className,
		} = props;

		const onChangeLayout = (newLayout) => {
			setAttributes({ layout: newLayout });
		};

		const onChangeTitle = (newTitle) => {
			setAttributes({ title: newTitle });
		};

		const onChangeContent = (newContent) => {
			setAttributes({ content: newContent });
		};

		const onSelectImage = (img) => {
			setAttributes({
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt,
			});
		};

		return (
			<div className={`${className} ${layout}`}>
				<InspectorControls>
					<SelectControl
						label="Layout"
						value={layout}
						options={[
							{ label: "Image on the left", value: "image-left" },
							{ label: "Image on the right", value: "image-right" },
						]}
						onChange={onChangeLayout}
					/>
				</InspectorControls>

				<div className="image">
					<MediaUpload
						onSelect={onSelectImage}
						type="image"
						value={imgID}
						render={({ open }) => (
							<Button onClick={open}>
								{!imgID ? "Upload Image" : <img src={imgURL} alt={imgAlt} />}
							</Button>
						)}
					/>
				</div>

				<div className="text">
					<RichText
						tagName="h3"
						placeholder="Title"
						value={title}
						onChange={onChangeTitle}
					/>

					<RichText
						tagName="p"
						placeholder="Content"
						value={content}
						onChange={onChangeContent}
					/>
				</div>
			</div>
		);
	},
	save: (props) => {
		const {
			attributes: { imgURL, imgAlt, title, content, layout },
		} = props;

		return (
			<div className={layout}>
				<div className="image">
					<img src={imgURL} alt={imgAlt} />
				</div>

				<div className="text">
					<RichText.Content tagName="h3" value={title} />
					<RichText.Content tagName="p" value={content} />
				</div>
			</div>
		);
	},
});
