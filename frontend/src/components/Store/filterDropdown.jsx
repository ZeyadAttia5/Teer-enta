import React, { useState, useEffect } from 'react';
import {
  Button,
  Drawer,
  Slider,
  Radio,
  Space,
  Divider,
  Typography,
  InputNumber,
  Tooltip,
  Badge ,
    Tag
} from 'antd';
import {
  FilterOutlined,
  SortAscendingOutlined,
  DollarOutlined,
  StarOutlined,
  OrderedListOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const FilterDropdown = ({ filters, onFilterChange }) => {
  const defaultFilters = {
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'rating',
    sortOrder: 'desc'
  };

  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || "desc");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSortBy(filters.sortBy);
    setSortOrder(filters.sortOrder || "desc");
  }, [filters]);

  // Function to check if any filters are active
  const hasActiveFilters = () => {
    return (
        minPrice !== defaultFilters.minPrice ||
        maxPrice !== defaultFilters.maxPrice ||
        sortBy !== defaultFilters.sortBy ||
        sortOrder !== defaultFilters.sortOrder
    );
  };

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice, sortBy, sortOrder });
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setMinPrice(defaultFilters.minPrice);
    setMaxPrice(defaultFilters.maxPrice);
    setSortBy(defaultFilters.sortBy);
    setSortOrder(defaultFilters.sortOrder);
    onFilterChange(defaultFilters);
  };

  const handleSortChange = (value) => {
    const [sort, order] = value.split('-');
    setSortBy(sort);
    setSortOrder(order);
  };

  const handlePriceChange = (values) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const sortOptions = [
    {
      label: (
          <Space>
            <StarOutlined />
            Ratings: High to Low
          </Space>
      ),
      value: 'rating-desc'
    },
    {
      label: (
          <Space>
            <StarOutlined className="rotate-180" />
            Ratings: Low to High
          </Space>
      ),
      value: 'rating-asc'
    },
    {
      label: (
          <Space>
            <DollarOutlined />
            Price: High to Low
          </Space>
      ),
      value: 'price-desc'
    },
    {
      label: (
          <Space>
            <DollarOutlined className="rotate-180" />
            Price: Low to High
          </Space>
      ),
      value: 'price-asc'
    },
    {
      label: (
          <Space>
            <OrderedListOutlined />
            Alphabetically
          </Space>
      ),
      value: 'name-asc'
    }
  ];

  return (
      <div className="relative inline-block">
        <Badge dot={hasActiveFilters()} offset={[-2, 2]}>
          <Button
              type="danger"
              icon={<FilterOutlined />}
              onClick={() => setIsOpen(true)}
              className="flex-1 bg-fourth hover:bg-third text-black"
          >
            Filters & Sort
          </Button>
        </Badge>

        <Drawer
            title={
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FilterOutlined />
                  <span>Filters & Sort</span>
                </div>
                {hasActiveFilters() && (
                    <Tooltip title="Clear all filters">
                      <Button
                          icon={<ClearOutlined />}
                          onClick={handleClearAll}
                          type="text"
                          className="hover:text-[#458177]"
                      >
                        Clear All
                      </Button>
                    </Tooltip>
                )}
              </div>
            }
            placement="right"
            onClose={() => setIsOpen(false)}
            open={isOpen}
            width={320}
            footer={
              <div className="flex justify-between gap-2">
                <Button
                    onClick={() => setIsOpen(false)}
                    className="w-1/3"
                >
                  Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={handleApply}
                    className="bg-first hover:bg-[#458177] w-2/3 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            }
        >
          <div className="space-y-6">
            {/* Active Filters Summary */}
            {hasActiveFilters() && (
                <div className="bg-first rounded-md">
                  <Text type="secondary">Active Filters:</Text>
                  <div className="flex flex-wrap bg-first mt-2">
                    {minPrice !== defaultFilters.minPrice || maxPrice !== defaultFilters.maxPrice ? (
                        <Tag closable onClose={() => {
                          setMinPrice(defaultFilters.minPrice);
                          setMaxPrice(defaultFilters.maxPrice);
                        }}>
                          Price: ${minPrice} - ${maxPrice}
                        </Tag>
                    ) : null}
                    {(sortBy !== defaultFilters.sortBy || sortOrder !== defaultFilters.sortOrder) && (
                        <Tag closable onClose={() => {
                          setSortBy(defaultFilters.sortBy);
                          setSortOrder(defaultFilters.sortOrder);
                        }}>
                          Sort: {sortOptions.find(opt => opt.value === `${sortBy}-${sortOrder}`)?.label?.props?.children[1]}
                        </Tag>
                    )}
                  </div>
                </div>
            )}

            {/* Price Range Section */}
            <div>
              <Title level={5} className="mb-4 flex items-center gap-2">
                <DollarOutlined />
                Price Range
              </Title>
              <div className="px-2">
                <Slider
                    range
                    min={0}
                    max={1000}
                    value={[minPrice, maxPrice]}
                    onChange={handlePriceChange}
                    className="mb-4"
                    tooltip={{
                      formatter: (value) => `$${value}`
                    }}
                />
                <div className="flex justify-between items-center gap-4">
                  <InputNumber
                      min={0}
                      max={maxPrice}
                      value={minPrice}
                      onChange={(value) => setMinPrice(value)}
                      prefix="$"
                      className="w-full"
                  />
                  <Text type="secondary">to</Text>
                  <InputNumber
                      min={minPrice}
                      max={1000}
                      value={maxPrice}
                      onChange={(value) => setMaxPrice(value)}
                      prefix="$"
                      className="w-full"
                  />
                </div>
              </div>
            </div>

            <Divider />

            {/* Sort Options Section */}
            <div>
              <Title level={5} className="mb-4 flex items-center gap-2">
                <SortAscendingOutlined />
                Sort By
              </Title>
              <Radio.Group
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full space-y-3"
              >
                <Space direction="vertical" className="w-full">
                  {sortOptions.map(option => (
                      <Radio
                          key={option.value}
                          value={option.value}
                          className="w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        {option.label}
                      </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Drawer>
      </div>
  );
};

export default FilterDropdown;