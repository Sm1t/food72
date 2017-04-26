export default async (model) => {
	const arr = await model.find();
	if (!arr[0]) return;
	let lastModified = arr.reduce(function(prev, candidate) {
		return (prev.updatedAt > candidate.updatedAt) ? prev : candidate;
	});
	lastModified = Date.parse(lastModified.updatedAt);
	const opts = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'short',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
		hour12: false
	};
	lastModified = (new Date(lastModified)).toLocaleString('en-US', opts);
	return lastModified;
}