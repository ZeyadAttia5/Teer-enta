import { useEffect, useState } from "react";
import { TActivity } from "../../types/Activity/Activity.ts";
import { getActivities, getUpcomingActivities } from "../../api/activity.ts";
import React from "react";
import { Switch, Table, Tag, Form, Input } from "antd";
import { TActivityCategory } from "../../types/Activity/ActivityCategory.ts";
import { TTag } from "../../types/Tag.ts";
import Filter from "../../components/Filter.jsx";
import {TPreferenceTag} from "../../types/Itinerary/PreferenceTag";

// Tactivity keys are the dataIndex of each object in the data array
const columns = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    ...Filter({
      dataIndex: "name",
      filterFunction: (value, record) =>
        record.name.toLowerCase().startsWith(value.toLowerCase()),
      type: "text",
    }),
  },
  {
    title: "date",
    dataIndex: "date",
    key: "date",
    ...Filter({
      dataIndex: "date",
      filterFunction: (value, record) =>
        new Date(value).getTime() === new Date(record.date).getTime(),
      type: "date",
    }),
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    title: "time",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "isBookingOpen",
    dataIndex: "isBookingOpen",
    key: "isBookingOpen",
    render: (value: boolean) => (value ? "Yes" : "No"),
  },
  {
    title: "location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "isActive",
    dataIndex: "isActive",
    key: "isActive",
    render: (value: boolean) => (value ? "Yes" : "No"),
  },
  {
    title: "price",
    dataIndex: "price",
    key: "price",
    render: (value: { min: Number; max: Number }) =>
      `${value.min}-${value.max}`,
    sorter: (a: TActivity, b: TActivity) =>
      (a.price.min ?? 0 + (a.price.max ?? 0)) -
      ((b.price.min ?? 0) + (b.price.max ?? 0)),
    ...Filter({
      dataIndex: "price",
      filterFunction: (value, record) => {
        let v = Number.parseInt(value);
        return record.price.min <= v && record.price.max >= v;
      },
      type: "number",
    }),
  },
  {
    title: "category",
    dataIndex: "category",
    key: "category",
    ...Filter({
      dataIndex: "category",
      filterFunction: (value, record) =>
        record.category?.category.toLowerCase().startsWith(value.toLowerCase()),
      type: "text",
    }),
    render: (value: TActivityCategory) => value?.category,
  },
  {
    title: "preferenceTags",
    dataIndex: "preferenceTags",
    key: "preferenceTags",
    filters: [],
    onFilter: (value, record) => record.tags?.some((tag) => tag._id === value),
    render: (preferenceTags: TPreferenceTag[]) => (
      <>
        {preferenceTags.map((tag, index) => {
          let color = index % 2 ? "geekblue" : "green";
          return (
            <Tag color={color} key={tag._id}>
              {tag.tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "specialDiscounts",
    dataIndex: "specialDiscounts",
    key: "specialDiscounts",
    render: (
      discounts: {
        discount: number;
        Description: string;
        isAvailable: boolean;
      }[]
    ) => (
      <>
        {discounts.map((discount, index) => {
          return (
            <Tag color={discount.isAvailable ? "green" : "red"} key={index}>
              {discount.Description?.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "ratings",
    dataIndex: "ratings",
    key: "ratings",
    ...Filter({
      dataIndex: "ratings",
      filterFunction: (value, record) =>
        record.ratings.some(
          (rating) => rating.rating === Number.parseFloat(value)
        ),
      type: "number",
    }),
    render: (ratings: { createdBy: string; rating: number }[]) => (
      <>
        {ratings.map((rating) => {
          return (
            <Tag
              color={rating.rating > 2.5 ? "blue" : "warning"}
              key={rating.createdBy}
            >
              {rating.rating}
            </Tag>
          );
        })}
      </>
    ),
    sorter: (a: TActivity, b: TActivity) =>
      a.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
        (a.ratings.length || 1) -
      b.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
        (b.ratings.length || 1),
  },
  {
    title: "comments",
    dataIndex: "comments",
    key: "comments",
    render: (comments: { createdBy: string; comment: string }[]) => (
      <>
        {comments.map((comment) => {
          return (
            <Tag color="cyan" key={comment.createdBy}>
              {comment.comment}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const ActivityList = () => {
  const [activities, setActivities] = useState<TActivity[]>([]);
  const [upcoming, setUpcoming] = useState(false);
  useEffect(() => {
    if (upcoming)
      getUpcomingActivities()
        .then((res) => setActivities(res.data))
        .catch((err) => console.log(err));
    else
      getActivities()
        .then((res) => setActivities(res.data))
        .catch((err) => console.log(err));
  }, [upcoming]);

  useEffect(() => {
    columns.forEach((column) => {
      if (column.key === "preferenceTags")
        column["filters"] = activities
          .map((activity) => activity.preferenceTags)
          .flat()
          .map((tag) => ({ text: tag.tag, value: tag._id }));
    });
  }, [activities]);

  return (
    <main className="size-full p-16">
      <Form.Item label="Show Upcoming Activities">
        <Switch checked={upcoming} onChange={() => setUpcoming(!upcoming)} />
      </Form.Item>
      <Table<TActivity>
        scroll={{
          x: "max-content",
        }}
        bordered
        className="h-full"
        dataSource={activities}
        columns={columns}
      />
    </main>
  );
};

export default ActivityList;
