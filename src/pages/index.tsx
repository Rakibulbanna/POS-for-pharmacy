import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { RingProgress, Text, SimpleGrid, Paper, Center, Group } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export default function Home() {
  const [datas, setDatas] = useState([]);
  const [todaySale, setTodaySale] = useState(0);
  const [thisMonthSale, setThisMonthSale] = useState(0);

  useEffect(() => {
    HTTP.get(`${BaseAPI}/dashboard`).then(res => {
      setDatas(() => {
        return [
          { label: 'Today Sale', stats: Math.round(res.data.data.today_sale), progress: 50, color: "green", icon: 'down' },
          { label: 'This Month Sale', stats: Math.round(res.data.data.this_month_sale), progress: 60, color: "blue", icon: 'down' },
        ]
      })

    }).catch(err => {
      console.log(err);
    })
  }, [])
  const stats = datas.length > 0 && datas.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={22} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats ?? 0}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });
  return (
    <div className="bg-gray-100 w-full h-full p-2">
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {stats}
      </SimpleGrid>
    </div>
  );
}
