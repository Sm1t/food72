export default async (model, modifiedSince) => {
	modifiedSince = new Date(Date.parse(modifiedSince));
	let news = await model.find({"updatedAt": {$gt: modifiedSince}});
	if (news[0]) {
		let lastModified = news.reduce(function(prev, candidate) {
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
		return {
			news,
			lastModified
		}
	} else {
		return;
	}
}