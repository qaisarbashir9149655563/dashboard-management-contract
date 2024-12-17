import React, { useState, useEffect } from 'react';
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content } = Layout;
const { Option } = Select;

const generateMockContracts = () => {
  return Array.from({ length: 50 }, (_, index) => ({
    id: `CONTRACT-${1000 + index}`,
    clientName: `Client ${index + 1}`,
    status: ['Draft', 'In Progress', 'Finalized', 'Expired'][
      Math.floor(Math.random() * 4)
    ],
    value: Math.floor(Math.random() * 100000),
    startDate: new Date(
      2022,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
  }));
};

const App = () => {
  const [contracts, setContracts] = useState(generateMockContracts());
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [editingContract, setEditingContract] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewContractModalVisible, setIsNewContractModalVisible] =
    useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form] = Form.useForm();
  const [newContractForm] = Form.useForm();

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleSearch = (value) => {
    const filtered = contracts.filter(
      (contract) =>
        contract.clientName.toLowerCase().includes(value.toLowerCase()) ||
        contract.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContracts(filtered);
  };

  const handleEditContract = (record) => {
    setEditingContract(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleUpdateContract = (values) => {
    const updatedContracts = contracts.map((contract) =>
      contract.id === editingContract.id ? { ...contract, ...values } : contract
    );
    setContracts(updatedContracts);
    setFilteredContracts(updatedContracts);
    setIsModalVisible(false);
    message.success('Contract updated successfully');
  };

  const handleCreateNewContract = (values) => {
    const newContract = {
      ...values,
      id: `CONTRACT-${contracts.length + 1000}`,
      status: 'Draft',
    };
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    setFilteredContracts(updatedContracts);
    setIsNewContractModalVisible(false);
    message.success('New contract created successfully');
  };

  const columns = [
    {
      title: 'Contract ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      sorter: (a, b) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Draft', value: 'Draft' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Finalized', value: 'Finalized' },
        { text: 'Expired', value: 'Expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Contract Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditContract(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="flex justify-between" style={{ height: '100%' }}>
        <h1 className="text-white text-xl">Contract Management Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-2 text-white">Dark Mode</span>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
      </Header>
      <Content className="p-6">
        <div className="flex justify-between mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search contracts"
            style={{ width: 200, margin: '20px' }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            type="secondary"
            icon={<PlusOutlined />}
            onClick={() => setIsNewContractModalVisible(true)}
          >
            Generate New Contract
          </Button>
        </div>

        <Table columns={columns} dataSource={filteredContracts} rowKey="id" />

        <Modal
          title="Edit Contract"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdateContract}>
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={[{ required: true, message: 'Please input client name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Option value="Draft">Draft</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Finalized">Finalized</Option>
                <Option value="Expired">Expired</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="value"
              label="Contract Value"
              rules={[
                { required: true, message: 'Please input contract value!' },
              ]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Generate New Contract"
          visible={isNewContractModalVisible}
          onCancel={() => setIsNewContractModalVisible(false)}
          onOk={() => newContractForm.submit()}
        >
          <Form
            form={newContractForm}
            layout="vertical"
            onFinish={handleCreateNewContract}
          >
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={[{ required: true, message: 'Please input client name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="value"
              label="Contract Value"
              rules={[
                { required: true, message: 'Please input contract value!' },
                {
                  validator: (_, value) =>
                    value && Number(value) >= 0
                      ? Promise.resolve()
                      : Promise.reject('Value must be positive!'),
                },
              ]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date!' }]}
            >
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
