import dayjs from 'dayjs';

export const formatDate = (date: Date | string | number): string => {
	return dayjs(date).format('HH:mm DD/MM/YYYY');
};
