const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, PanelRow, SelectControl, TextControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

registerBlockType("cgb/portfolio", {
	title: "Portfolio",
	icon: "grid-view",
	category: "layout",
	attributes: {
		postsToShow: {
			type: "number",
			default: -1,
		},
		order: {
			type: "string",
			default: "DESC",
		},
	},

	edit: (props) => {
		const {
			attributes: { postsToShow, order },
			setAttributes,
			className,
		} = props;

		return (
			<div className={className}>
				<InspectorControls>
					<PanelBody title="Portfolio Settings" initialOpen={true}>
						<PanelRow>
							<TextControl
								label="Number of posts to show"
								type="number"
								value={postsToShow}
								onChange={(value) =>
									setAttributes({ postsToShow: parseInt(value, 10) })
								}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label="Order"
								value={order}
								options={[
									{ label: "Descending", value: "DESC" },
									{ label: "Ascending", value: "ASC" },
								]}
								onChange={(value) => setAttributes({ order: value })}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<ServerSideRender
					block="cgb/portfolio"
					attributes={{ postsToShow, order }}
				/>
			</div>
		);
	},
	save: () => {
		return null;
	},
});
