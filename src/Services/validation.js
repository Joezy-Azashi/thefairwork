

export const validEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const ConvertedCities = (data = []) => {
	const citiConverted = [];

	data.forEach((city) => {
		citiConverted.push({ label: `${city.name}`, value: city.id });
	});

	return citiConverted;
};

export const ConvertedType = (data = []) => {
	const typeConverted = [];

	data.forEach((type) => {
		typeConverted.push({ label: `${type.name}`});
	});

	return typeConverted;
};


export function ProjectStatus(){
    return [
        { name: 'Posted', value: 'Posted'},
        { name: 'Interviewing', value: 'Interviewing'},
        { name: 'In-progress', value: 'In-progress'},
        { name: 'Completed', value: 'Completed'},
    ];
}

export function Proficiency(){
    return [
        { name: 'Beginner', value: 'Beginner'},
        { name: 'Intermediate', value: 'Intermediate'},
        { name: 'Expert', value: 'Expert'},
    ];
}

export function SkillsType(){
    return [
        { name: 'IT Industry', value: 'FreelancerCategories'},
        { name: 'Others', value: 'GhanaCategories'}
    ];
}