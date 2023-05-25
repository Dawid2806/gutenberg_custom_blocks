import style from "./style.scss";
import editor from "./editor.scss";
import { registerBlockType } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { RichText, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import "./editor.scss";

registerBlockType("cgb/einzelmaschinenblock", {
	title: "Einzelmaschinen Block",
	icon: "smiley",
	category: "common",
	attributes: {
		postsToShow: {
			type: "number",
			default: 5,
		},
		order: {
			type: "string",
			default: "desc",
		},
		categoryTitles: {
			type: "array",
			default: [],
			source: "children",
			selector: "h2",
		},
		machineTitles: {
			type: "array",
			default: [],
			source: "children",
			selector: "h3",
		},
	},
	edit: ({
		attributes: { postsToShow, order, categoryTitles, machineTitles },
		setAttributes,
	}) => {
		const maschinen = useSelect((select) =>
			select("core").getEntityRecords("postType", "einzelmaschine", {
				per_page: postsToShow,
				order: order,
			})
		);
		const categories = useSelect((select) =>
			select("core").getEntityRecords("taxonomy", "category")
		);

		// Initialize categoryTitles and machineTitles based on available categories and machines
		if (!categoryTitles.length && categories) {
			setAttributes({
				categoryTitles: categories.map((category) => category.name),
			});
		}
		if (!machineTitles.length && maschinen) {
			setAttributes({
				machineTitles: maschinen.map((maschine) => maschine.title.rendered),
			});
		}

		const updateCategoryTitle = (i, newTitle) => {
			let newTitles = [...categoryTitles];
			newTitles[i] = newTitle;
			setAttributes({ categoryTitles: newTitles });
		};

		const updateMachineTitle = (i, newTitle) => {
			let newTitles = [...machineTitles];
			newTitles[i] = newTitle;
			setAttributes({ machineTitles: newTitles });
		};

		return (
			<div>
				<InspectorControls>
					<PanelBody title={__("Post Settings", "cgb")}>
						<RangeControl
							label={__("Number of posts", "cgb")}
							value={postsToShow}
							onChange={(value) => setAttributes({ postsToShow: value })}
							min={1}
							max={100}
						/>
						<SelectControl
							label={__("Order", "cgb")}
							value={order}
							options={[
								{ label: __("Descending", "cgb"), value: "desc" },
								{ label: __("Ascending", "cgb"), value: "asc" },
							]}
							onChange={(value) => setAttributes({ order: value })}
						/>
					</PanelBody>
				</InspectorControls>
				{categories &&
					categories.map(
						(category, i) =>
							category.slug !== "uncategorized" && (
								<div key={category.id}>
									<RichText
										formTarget=""
										tagName="h2"
										value={categoryTitles[i] || category.name}
										onChange={(newTitle) => updateCategoryTitle(i, newTitle)}
									/>
									{maschinen &&
										maschinen.map(
											(maschine, j) =>
												maschine.categories.includes(category.id) && (
													<div key={maschine.id}>
														<RichText
															tagName="h3"
															value={
																machineTitles[j] || maschine.title.rendered
															}
															onChange={(newTitle) =>
																updateMachineTitle(j, newTitle)
															}
														/>
														{maschine.acf.gallery &&
															maschine.acf.gallery.length > 0 && (
																<img
																	src={maschine.acf.gallery[0].url}
																	alt={maschine.acf.title}
																/>
															)}
													</div>
												)
										)}
								</div>
							)
					)}
			</div>
		);
	},
	save: () => {
		// Rendering in PHP, so return null
		return null;
	},
});
