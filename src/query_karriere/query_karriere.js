import "./editor.scss";
import "./style.scss";
const { SelectControl } = wp.components;
const { useSelect } = wp.data;

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { TextControl, PanelBody } = wp.components;

const { InspectorControls } = wp.blockEditor;
registerBlockType("cgb/daveblock", {
	title: "My Custom Block",
	icon: "smiley",
	category: "common",
	attributes: {
		postType: {
			type: "string",
			default: "post",
		},
		title: {
			type: "string",
			source: "text",
			selector: ".my-custom-block-title",
		},
		firstContent: {
			type: "string",
			source: "meta",
			meta: "first_content",
		},
	},
	edit: (props) => {
		const {
			attributes: { postType, title, firstContent },
			setAttributes,
		} = props;

		const postTypes = useSelect((select) => select("core").getPostTypes());

		const posts = useSelect((select) =>
			select("core").getEntityRecords("postType", postType)
		);

		const postOptions = postTypes
			? postTypes.map((type) => ({ label: type.name, value: type.slug }))
			: [];

		return (
			<div>
				<InspectorControls>
					<PanelBody title="My Custom Block Settings">
						<SelectControl
							label="Post Type"
							value={postType}
							options={postOptions}
							onChange={(selectedPostType) =>
								setAttributes({ postType: selectedPostType })
							}
						/>
						<TextControl
							label="Title"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
						/>
					</PanelBody>
				</InspectorControls>
				<h2 className="my-custom-block-title">{title}</h2>
				{posts &&
					posts.map((post) => (
						<p key={post.id}>
							{post.title && post.title.rendered}
							{post.excerpt && post.excerpt.rendered}
						</p>
					))}
			</div>
		);
	},
	save: (props) => {
		const {
			attributes: { title, firstContent },
		} = props;

		return (
			<div>
				<h2 className="my-custom-block-title">{title}</h2>
				<p>{firstContent}</p>
			</div>
		);
	},
});
