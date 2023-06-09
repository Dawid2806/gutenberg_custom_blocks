import "./editor.scss";
import "./style.scss";
const { SelectControl } = wp.components;
const { useSelect } = wp.data;

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { TextControl, PanelBody, RangeControl } = wp.components;

const { InspectorControls } = wp.blockEditor;
registerBlockType("cgb/daveblock", {
	title: "Query Karriere",
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
		postsToShow: {
			type: "number",
			default: 5, // domyślna wartość
		},
		order: {
			type: "string",
			default: "desc", // domyślna wartość
		},
		firstContent: {
			type: "string",
			source: "meta",
			meta: "first_content",
		},
	},
	edit: (props) => {
		const {
			attributes: { postType, title, firstContent, postsToShow, order },
			setAttributes,
		} = props;

		const postTypes = useSelect((select) => select("core").getPostTypes());

		const posts = useSelect((select) =>
			select("core").getEntityRecords("postType", postType, {
				per_page: postsToShow,
				order: order,
			})
		);

		const postsQuery = useSelect((select) =>
			select("core").getEntityRecords("postType", postType, {
				per_page: postsToShow,
				order: order,
			})
		);
		const postOptions = postTypes
			? postTypes.map((type) => ({ label: type.name, value: type.slug }))
			: [];

		return (
			<div>
				<InspectorControls>
					<PanelBody title="Post Settings">
						<RangeControl
							label="Number of posts"
							value={postsToShow}
							onChange={(value) => setAttributes({ postsToShow: value })}
							min={1}
							max={10}
						/>
						<SelectControl
							label="Order"
							value={order}
							options={[
								{ label: "Descending", value: "desc" },
								{ label: "Ascending", value: "asc" },
							]}
							onChange={(value) => setAttributes({ order: value })}
						/>
					</PanelBody>
				</InspectorControls>
				<h3 className="my-custom-block-title">{title}</h3>
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

		return null;
	},
});
