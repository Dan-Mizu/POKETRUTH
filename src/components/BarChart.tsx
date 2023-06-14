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
    date: 'Sunday, June 11, 2023',
    EmoteUsage: 4317,
    OPH: 949.6,
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
        <p className='label'>{`${label}`}</p>
        <hr className='mx-auto mb-3 mt-1 h-px w-48 rounded bg-white'></hr>
        <p className='label'>Total OMEGALULs</p>
        <p className='text-gray-100'>{payload?.[0].value}</p>
        <br />
        <p className='label'>OMEGALULs</p>
        <p className='label'>Per Hour (OPH)</p>
        <p className='text-blue-200'>{payload?.[1].value}</p>
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
