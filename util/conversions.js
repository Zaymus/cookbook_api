const {
	GRAMS_OUNCE_DIVISOR,
	GRAMS_K_M_CONST,
	MILLILITRE_TEASPOON_CONST,
	MILLILITRE_TABLESPOON_CONST,
	MILLILITRE_CUP_CONST,
	TEASPOON_TABLESPOON_CONST,
	TEASPOON_CUP_CONST,
	TABLESPOON_MILLILITRE_CONST,
	TABLESPOON_CUP_CONST,
	MILLILITRE_OUNCE_CONST,
	TEASPOON_OUNCE_CONST,
	TABLESPOON_OUNCE_CONST,
	CUP_OUNCE_CONST,
} = require("./constants");

exports.CONVERSIONS = {
	gramsToOunce: (grams) => {
		return (
			Math.round((grams / GRAMS_OUNCE_DIVISOR + Number.EPSILON) * 10000) / 10000
		);
	},
	gramsToMilligram: (grams) => {
		return (
			Math.round((grams * GRAMS_K_M_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	gramsToKilogram: (grams) => {
		return (
			Math.round((grams / GRAMS_K_M_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	milligramsToOunce: (milligrams) => {
		return (
			Math.round(
				((milligrams * GRAMS_K_M_CONST) / GRAMS_OUNCE_DIVISOR +
					Number.EPSILON) *
					10000
			) / 10000
		);
	},
	milligramsTogram: (milligrams) => {
		return (
			Math.round(
				(milligrams * (GRAMS_K_M_CONST * GRAMS_K_M_CONST) + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	milligramsToKillogram: (milligrams) => {
		return (
			Math.round(
				(milligrams / (GRAMS_K_M_CONST * GRAMS_K_M_CONST) + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	kilogramsToOunce: (kilograms) => {
		return (
			Math.round(
				(kilograms / GRAMS_K_M_CONST / GRAMS_OUNCE_DIVISOR + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	kilogramsToGram: (kilograms) => {
		return (
			Math.round((kilograms / GRAMS_K_M_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	kilogramsToMilligram: (kilograms) => {
		return (
			Math.round(
				(kilograms * (GRAMS_K_M_CONST * GRAMS_K_M_CONST) + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	ouncesToGram: (ounces) => {
		return (
			Math.round((ounces * GRAMS_OUNCE_DIVISOR + Number.EPSILON) * 10000) /
			10000
		);
	},
	ouncesToMilligram: (ounces) => {
		return (
			Math.round(
				(ounces * GRAMS_OUNCE_DIVISOR * GRAMS_K_M_CONST + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	ouncesTokilogram: (ounces) => {
		return (
			Math.round(
				(ounces / GRAMS_OUNCE_DIVISOR / GRAMS_K_M_CONST + Number.EPSILON) *
					10000
			) / 10000
		);
	},
	ouncesToTeaspoon: (ounces) => {
		return (
			Math.round((ounces * TEASPOON_OUNCE_CONST + Number.EPSILON) * 10000) /
			10000
		);
	},
	ouncesToTablespoon: (ounces) => {
		return (
			Math.round((ounces * TABLESPOON_OUNCE_CONST + Number.EPSILON) * 10000) /
			10000
		);
	},
	ouncesToCup: (ounces) => {
		return (
			Math.round((ounces / CUP_OUNCE_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	millilitresToTeaspoon: (millilitres) => {
		return (
			Math.round(
				(millilitres / MILLILITRE_TEASPOON_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	millilitresToTablespoon: (millilitres) => {
		return (
			Math.round(
				(millilitres / MILLILITRE_TABLESPOON_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	millilitresToOunce: (millilitres) => {
		return (
			Math.round(
				(millilitres / MILLILITRE_OUNCE_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	millilitresToCup: (millilitres) => {
		return (
			Math.round(
				(millilitres / MILLILITRE_CUP_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	teaspoonToMillilitres: (teaspoon) => {
		return (
			Math.round(
				(teaspoon * MILLILITRE_TEASPOON_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	teaspoonToTablespoon: (teaspoon) => {
		return (
			Math.round(
				(teaspoon / TEASPOON_TABLESPOON_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	teaspoonToCup: (teaspoon) => {
		return (
			Math.round((teaspoon / TEASPOON_CUP_CONST + Number.EPSILON) * 10000) /
			10000
		);
	},
	teaspoonToOunce: (teaspoon) => {
		return (
			Math.round((teaspoon / TEASPOON_OUNCE_CONST + Number.EPSILON) * 10000) /
			10000
		);
	},
	tablespoonToCup: (tablespoon) => {
		return (
			Math.round((tablespoon / TABLESPOON_CUP_CONST + Number.EPSILON) * 10000) /
			10000
		);
	},
	tablespoonToMillilitres: (tablespoon) => {
		return (
			Math.round(
				(tablespoon * TABLESPOON_MILLILITRE_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	tablespoonToTeaspoon: (tablespoon) => {
		return (
			Math.round(
				(tablespoon * TEASPOON_TABLESPOON_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	tablespoonToOunce: (tablespoon) => {
		return (
			Math.round(
				(tablespoon / TABLESPOON_OUNCE_CONST + Number.EPSILON) * 10000
			) / 10000
		);
	},
	cupToTeaspoon: (cup) => {
		return (
			Math.round((cup * TEASPOON_CUP_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	cupToTablespoon: (cup) => {
		return (
			Math.round((cup * TABLESPOON_CUP_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
	cubToOunce: (cup) => {
		return Math.round((cup * CUP_OUNCE_CONST + Number.EPSILON) * 10000) / 10000;
	},
	cupToMillilitre: (cup) => {
		return (
			Math.round((cup * MILLILITRE_CUP_CONST + Number.EPSILON) * 10000) / 10000
		);
	},
};
