import { useEffect, useState } from "react";
import { TActivity } from "../types/Activity/Activity.ts";
import { getActivities, getUpcomingActivities } from "../api/activity.ts";
import React from "react";
import { Switch, Table, Tag, Form, Input } from "antd";
import { TActivityCategory } from "../types/Activity/ActivityCategory.ts";
import { TTag } from "../types/Tag.ts";
import { SearchOutlined } from "@ant-design/icons";
import Filter from "../components/Filter.jsx";

// Tactivity keys are the dataIndex of each object in the data array
const columns = [
  // {
  //   title: "id",
  //   dataIndex: "_id",
  //   key: "_id",
  // },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "date",
    dataIndex: "date",
    key: "date",
    ...Filter({
      dataIndex: "price",
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
    render: (value: TActivityCategory) => value?.category,
  },
  {
    title: "tags",
    dataIndex: "tags",
    key: "tags",
    render: (tags: TTag[]) => (
      <>
        {tags.map((tag, index) => {
          let color = index % 2 ? "geekblue" : "green";
          return (
            <Tag color={color} key={tag._id}>
              {tag.name.toUpperCase()}
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
      filterFunction: (value, record) => {
        // console.log(value, record);
        
        return record.ratings.some((rating) => {
          console.log(rating.rating, value);
          
          return rating.rating === Number.parseFloat(value)});},
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

const Activity = () => {
  const [activities, setActivities] = useState<TActivity[]>();
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

export default Activity;
