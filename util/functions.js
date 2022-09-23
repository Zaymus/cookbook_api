const {
	FLUID_UNITS,
	MACRO_CONSTANTS,
	WEIGHT_UNITS,
	ACCEPTED_MEASUREMENTS,
} = require("../util/constants");

const CONVERSIONS = require("../util/conversions").CONVERSIONS;

const convertUnit = (currentUnit, newUnit, amount) => {
	switch (currentUnit) {
		case WEIGHT_UNITS.GRAM:
			switch (newUnit) {
				case WEIGHT_UNITS.OUNCE:
					return CONVERSIONS.gramsToOunce(amount);
				case WEIGHT_UNITS.MILLIGRAM:
					return CONVERSIONS.gramsToMilligram(amount);
				case WEIGHT_UNITS.KILOGRAM:
					return CONVERSIONS.gramsToKilogram(amount);
				default:
					return amount;
			}
		case WEIGHT_UNITS.MILLIGRAM:
			switch (newUnit) {
				case WEIGHT_UNITS.OUNCE:
					return CONVERSIONS.milligramsToOunce(amount);
				case WEIGHT_UNITS.GRAM:
					return CONVERSIONS.milligramsToGram(amount);
				case WEIGHT_UNITS.KILOGRAM:
					return CONVERSIONS.milligramsToKillogram(amount);
				default:
					return amount;
			}
		case WEIGHT_UNITS.KILOGRAM:
			switch (newUnit) {
				case WEIGHT_UNITS.OUNCE:
					return CONVERSIONS.kilogramsToOunce(amount);
				case WEIGHT_UNITS.MILLIGRAM:
					return CONVERSIONS.kilogramsToMilligram(amount);
				case WEIGHT_UNITS.GRAM:
					return CONVERSIONS.kilogramsToGram(amount);
				default:
					return amount;
			}
		case WEIGHT_UNITS.OUNCE:
			switch (newUnit) {
				case WEIGHT_UNITS.MILLIGRAM:
					return CONVERSIONS.ouncesToMilligram(amount);
				case WEIGHT_UNITS.GRAM:
					return CONVERSIONS.ouncesToGram(amount);
				case WEIGHT_UNITS.KILOGRAM:
					return CONVERSIONS.ouncesTokilogram(amount);
				default:
					return amount;
			}
		case FLUID_UNITS.MILLILITRE:
			switch (newUnit) {
				case FLUID_UNITS.TEASPOON:
					return CONVERSIONS.millilitresToTeaspoon(amount);
				case FLUID_UNITS.TABLESPOON:
					return CONVERSIONS.millilitresToTablespoon(amount);
				case FLUID_UNITS.CUP:
					return CONVERSIONS.millilitresToCup(amount);
				default:
					return amount;
			}
		case FLUID_UNITS.TEASPOON:
			switch (newUnit) {
				case FLUID_UNITS.MILLILITRE:
					return CONVERSIONS.teaspoonToMillilitres(amount);
				case FLUID_UNITS.TABLESPOON:
					return CONVERSIONS.teaspoonToTablespoon(amount);
				case FLUID_UNITS.CUP:
					return CONVERSIONS.teaspoonToCup(amount);
				default:
					return amount;
			}
		case FLUID_UNITS.TABLESPOON:
			switch (newUnit) {
				case FLUID_UNITS.MILLILITRE:
					return CONVERSIONS.tablespoonToMillilitres(amount);
				case FLUID_UNITS.TEASPOON:
					return CONVERSIONS.tablespoonToTeaspoon(amount);
				case FLUID_UNITS.CUP:
					return CONVERSIONS.tablespoonToCup(amount);
				default:
					return amount;
			}
		case FLUID_UNITS.CUP:
			switch (newUnit) {
				case FLUID_UNITS.MILLILITRE:
					return CONVERSIONS.cupToMillilitre(amount);
				case FLUID_UNITS.TEASPOON:
					return CONVERSIONS.cupToTeaspoon(amount);
				case FLUID_UNITS.TABLESPOON:
					return CONVERSIONS.cupToTablespoon(amount);
				default:
					return amount;
			}
		default:
			return amount;
	}
};

const convertServingSizeUnit = (foodItem, foodData) => {
	if (
		ACCEPTED_MEASUREMENTS.filter((measure) => {
			return foodData.serving_unit === measure;
		}).length == 1
	) {
		// accurate conversion
		return convertUnit(
			foodData.serving_unit,
			foodItem.unit,
			foodData.serving_qty
		);
	}
	// default less accurate conversion
	return convertUnit(
		WEIGHT_UNITS.GRAM,
		foodItem.unit,
		foodData.serving_weight_grams
	);
};

const calculateMacroData = (totalFat, totalCarbs, totalProtein) => {
	const fatCals = totalFat * MACRO_CONSTANTS.FAT_CALORIES_GRAM;
	const carbCals = totalCarbs * MACRO_CONSTANTS.CARB_CALORIES_GRAM;
	const proteinCals = totalProtein * MACRO_CONSTANTS.PROTEIN_CALORIES_GRAM;
	const totalCals = fatCals + carbCals + proteinCals;

	const fat = (fatCals / totalCals) * 100;
	const carbs = (carbCals / totalCals) * 100;
	const protein = (proteinCals / totalCals) * 100;

	const fat_perc = Math.round((fat + Number.EPSILON) * 100) / 100;
	const carbs_perc = Math.round((carbs + Number.EPSILON) * 100) / 100;
	const protein_perc = Math.round((protein + Number.EPSILON) * 100) / 100;

	return {
		carbs: {
			total: totalCarbs,
			percentage: carbs_perc,
		},
		fat: {
			total: totalFat,
			percentage: fat_perc,
		},
		protein: {
			total: totalProtein,
			percentage: protein_perc,
		},
	};
};

module.exports = { calculateMacroData, convertServingSizeUnit };
