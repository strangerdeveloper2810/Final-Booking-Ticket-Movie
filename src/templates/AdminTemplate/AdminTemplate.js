import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { TOKEN, USER_LOGIN } from "../../util/settings/config";
import { Layout, Menu, Breadcrumb } from "antd";
import { FileOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import { history } from "../../App";
import Avatar from "antd/lib/avatar/avatar";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminTemplate = (props) => {
    //path, exact, Component

    const { Component, ...restProps } = props;
    const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => {
        // console.log(collapsed);
        setCollapsed(collapsed);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    if (!localStorage.getItem(USER_LOGIN)) {
        alert("Bạn không có quyền truy cập vào trang này !");
        return <Redirect to="/" />;
    }

    if (userLogin.maLoaiNguoiDung !== "QuanTri") {
        alert("Bạn không có quyền truy cập vào trang này !");
        return <Redirect to="/" />;
    }

    const operations = (
        <Fragment>
            {!_.isEmpty(userLogin) ? (
                <Fragment>
                    {" "}
                    <button
                        onClick={() => {
                            history.push("/profile");
                        }}
                    >
                        {" "}

                        <div className="text-white mr-20">
                            <Avatar src="https://joeschmoe.io/api/v1/random" /> {userLogin.hoTen}
                        </div>
                    </button>{" "}
                    <button
                        onClick={() => {
                            localStorage.removeItem(USER_LOGIN);
                            localStorage.removeItem(TOKEN);
                            history.push("/home");
                            window.location.reload();
                        }}
                        className="text-blue-800"
                    >
                        Đăng xuất
                    </button>{" "}
                </Fragment>
            ) : (
                ""
            )}
        </Fragment>
    );

    return (
        <Route
            {...restProps}
            render={(propsRoute) => {
                //props.location,props.history,props.match

                return (
                    <Fragment>
                        <Layout style={{ minHeight: "100vh" }}>
                            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                                <div className="logo p-5">
                                    <img
                                        src="https://cyberlearn.vn/wp-content/uploads/2020/03/cyberlearn-min-new-opt2.png"
                                        alt="..."
                                    />
                                </div>
                                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                                    <SubMenu key="sub1" icon={<UserOutlined />} title="Quản Lý User">
                                        <Menu.Item key="8" icon={<UserOutlined />}>
                                            <NavLink to="/admin/users">Duyệt User</NavLink>
                                        </Menu.Item>

                                        <Menu.Item key="9" icon={<UserOutlined />}>
                                            <NavLink to="/admin/users/addnew">Thêm User</NavLink>
                                        </Menu.Item>
                                    </SubMenu>

                                    <SubMenu key="sub2" icon={<FileOutlined />} title="Chức Năng Phim">
                                        <Menu.Item key="10" icon={<FileOutlined />}>
                                            <NavLink to="/admin/films">Duyệt Film</NavLink>
                                        </Menu.Item>

                                        <Menu.Item key="11" icon={<FileOutlined />}>
                                            <NavLink to="/admin/films/addnew">Thêm Mới</NavLink>
                                        </Menu.Item>
                                    </SubMenu>

                                </Menu>
                            </Sider>
                            <Layout className="site-layout">
                                <Header
                                    className="site-layout-background"
                                    style={{ padding: 0 }}
                                >
                                    <div className="text-right pr-10 pt-1">{operations}</div>
                                </Header>
                                <Content style={{ margin: "0 16px" }}>
                                    <Breadcrumb style={{ margin: "16px 0" }}>

                                    </Breadcrumb>
                                    <div
                                        className="site-layout-background"
                                        style={{ padding: 24, minHeight: "85vh" }}
                                    >
                                        <Component {...propsRoute} />
                                    </div>
                                </Content>
                                <Footer style={{ textAlign: "center" }}>
                                    Ant Design ©2018 Created by Ant UED
                                </Footer>
                            </Layout>
                        </Layout>
                    </Fragment>
                );
            }}
        />
    );
};

export default AdminTemplate;
