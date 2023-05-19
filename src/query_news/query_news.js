const { SelectControl } = wp.components;
const { useSelect } = wp.data;

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { TextControl, PanelBody, RangeControl } = wp.components;

const { InspectorControls } = wp.blockEditor;
registerBlockType("cgb/querynews", {
	title: "Query News",
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
			default: 5, // default value
		},
		order: {
			type: "string",
			default: "desc", // default value
		},
	},
	edit: (props) => {
		const {
			attributes: { postType, title, postsToShow, order },
			setAttributes,
		} = props;

		const postTypes = useSelect((select) => select("core").getPostTypes(), []);

		const postOptions = postTypes
			? postTypes.map((type) => ({ label: type.name, value: type.slug }))
			: [];

		const posts = useSelect((select) =>
			select("core").getEntityRecords("postType", postType, {
				per_page: postsToShow,
				order: order,
			})
		);

		return (
			<div>
				<InspectorControls>
					<PanelBody title="Post Settings">
						<SelectControl
							label="Post Type"
							value={postType}
							options={postOptions}
							onChange={(value) => setAttributes({ postType: value })}
						/>
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
					posts.map((post) => {
						// Convert the date string into a JS Date object.
						const dateObject = new Date(post.date);

						// Format the date.
						const formattedDate = `${dateObject.getDate()}.${
							dateObject.getMonth() + 1
						}.${dateObject.getFullYear()}`;

						return (
							<div key={post.id}>
								{post.title && post.title.rendered}
								<p>{formattedDate}</p>
								{post.excerpt && post.excerpt.rendered}
							</div>
						);
					})}
			</div>
		);
	},
	save: () => null,
});
