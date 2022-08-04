export const commaSeparator = value => {
	return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const tally = (value, sum) => {
	const total = sum ? (value / sum) * 100 : 0;
	if (value === 0 && sum === 0) {
		return '0%';
	}

	return total.toFixed(2) + '%';
};

const COUNT_ABBRS = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

export const formatCount = (count, withAbbr = false, decimals = 4) => {
	const i = count === 0 ? count : Math.floor(Math.log(count) / Math.log(1000));

	if (i < 0) {
		return count.toString();
	}

	let result = parseFloat((count / Math.pow(1000, i)).toFixed(decimals));
	if (withAbbr) {
		result += `${COUNT_ABBRS[i]}`;
	}

	return result;
};
