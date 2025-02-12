import { FC, PropsWithChildren } from 'react';

type ICardProps = {
	stats: number;
};

const Card: FC<PropsWithChildren<ICardProps>> = ({ stats, children }) => {
	return (
		<div
			className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
			data-testid="card"
		>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">{children}</div>
					<p className="text-2xl font-bold">{stats} kWh</p>
				</div>
			</div>
		</div>
	);
};

export default Card;
