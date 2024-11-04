import React, { useEffect, useState } from "react";
import { Select, Card, Space, Typography, Divider, Tag } from "antd";
import { TagsOutlined, AppstoreOutlined } from "@ant-design/icons";
import { getActivityCategories } from "../../api/activityCategory.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";

const { Title, Text } = Typography;

const SelectPrefrences = ({
  onCategoriesChange,
  onTagsChange,
  selectedCategories = [],
  selectedTags = [],
  disabled = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await getActivityCategories();
      setCategories(response.filter((cat) => cat.isActive));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getPreferenceTags();
      setTags(response.data.filter((tag) => tag.isActive));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const categoryOptions = categories.map((category) => ({
    label: (
      <Space>
        <AppstoreOutlined />
        <span>{category.category}</span>
      </Space>
    ),
    value: category._id,
    title: category.description || category.category,
  }));

  const tagOptions = tags.map((tag) => ({
    label: (
      <Space>
        <TagsOutlined />
        <span>{tag.tag}</span>
      </Space>
    ),
    value: tag._id,
  }));

  return (
    <Card className="w-full">
      <Space direction="vertical" className="w-full" size="large">
        <div>
          <Title level={5}>Activity Categories</Title>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select activity categories"
            value={selectedCategories}
            onChange={onCategoriesChange}
            options={categoryOptions}
            disabled={disabled}
            showSearch
            optionFilterProp="title"
            maxTagCount={3}
            maxTagTextLength={15}
            tagRender={({ label, value, closable, onClose }) => {
              const category = categories.find(
                (cat) => cat._id === value
              );
              return (
                <Tag
                  closable={closable}
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                  icon={<AppstoreOutlined />}
                >
                  {category?.category}
                </Tag>
              );
            }}
          />
          <Text type="secondary" className="mt-1 text-sm block">
            Selected: {selectedCategories.length} of {categories.length}{" "}
            categories
          </Text>
        </div>

        {/* <Divider style={{ margin: "12px 0" }} /> */}

        <div>
          <Title level={5}>Preference Tags</Title>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select preference tags"
            value={selectedTags}
            onChange={onTagsChange}
            options={tagOptions}
            disabled={disabled}
            showSearch
            maxTagCount={3}
            maxTagTextLength={15}
            tagRender={({ label, value, closable, onClose }) => {
              const tag = tags.find((t) => t._id === value);
              return (
                <Tag
                  closable={closable}
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                  icon={<TagsOutlined />}
                >
                  {tag?.tag}
                </Tag>
              );
            }}
          />
          <Text type="secondary" className="mt-1 text-sm block">
            Selected: {selectedTags.length} of {tags.length} tags
          </Text>
        </div>

        <div className="pt-2">
          {selectedCategories.length > 0 && (
            <div className="mb-2">
              <Text type="secondary">Selected Categories:</Text>
              <div className="mt-1">
                {selectedCategories.map((catId) => {
                  const category = categories.find(
                    (cat) => cat._id === catId
                  );
                  return (
                    category && (
                      <Tag
                        key={catId}
                        icon={<AppstoreOutlined />}
                        className="mb-1"
                      >
                        {category.category}
                      </Tag>
                    )
                  );
                })}
              </div>
            </div>
          )}

          {selectedTags.length > 0 && (
            <div>
              <Text type="secondary">Selected Tags:</Text>
              <div className="mt-1">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t._id === tagId);
                  return (
                    tag && (
                      <Tag key={tagId} icon={<TagsOutlined />} className="mb-1">
                        {tag.tag}
                      </Tag>
                    )
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default SelectPrefrences;
