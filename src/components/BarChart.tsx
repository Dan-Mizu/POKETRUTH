import React from 'react';
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const data = [
  {
    date: 'Thursday, June 8, 2023',
    EmoteUsage: 6359,
    OPH: 1171.2,
  },
  {
    date: 'Saturday, June 10, 2023',
    EmoteUsage: 1992,
    OPH: 199.2793297798632,
  },
  {
    date: 'Sunday, June 11, 2023',
    EmoteUsage: 5412,
    OPH: 916.16,
  },
  {
    date: 'Monday, June 12, 2023',
    EmoteUsage: 11111,
    OPH: 1960.39,
  },
  {
    date: 'Tuesday, June 13, 2023',
    EmoteUsage: 10608,
    OPH: 1547.12,
  },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className='custom-tooltip space rounded-lg bg-blue-400 bg-opacity-95 p-5 text-lg text-white'>
        <p className='label'>{label}</p>
        <p className='label'>
          {parseFloat(
            (Number(payload?.[0].value) / Number(payload?.[1].value)).toFixed(2)
          )}{' '}
          Hours
        </p>
        <hr className='mx-auto mb-3 mt-1 h-px w-48 rounded bg-white'></hr>
        <p className='label'>Total OMEGALULs</p>
        <p className=' text-xl text-gray-100'>{payload?.[0].value}</p>
        <br />
        <p className='label'>OMEGALULs</p>
        <p className='label'>Per Hour (OPH)</p>
        <p className='text-xl text-blue-200'>
          {parseFloat(Number(payload?.[1].value).toFixed(2))}
        </p>
      </div>
    );
  }

  return null;
};

export default function App() {
  const white = '#ffffff';
  const gray = '#bfc9c6';
  const blue = '#0e86d4';

  return (
    <ComposedChart
      width={1000}
      height={700}
      data={data}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <XAxis dataKey='date' stroke={gray} />
      <YAxis stroke={gray} />
      <Tooltip cursor={false} content={<CustomTooltip />} />
      <Legend />
      <Bar
        dataKey='EmoteUsage'
        barSize={60}
        fill={white}
        radius={[15, 15, 0, 0]}
      />
      <Line type='natural' dataKey='OPH' stroke={blue} strokeWidth={4} />
    </ComposedChart>
  );
}
