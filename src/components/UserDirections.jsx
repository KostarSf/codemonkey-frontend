import React, { forwardRef, useContext, useEffect, useState } from "react";
import "./userdirections.css";
import { Button, Dropdown, Form } from "react-bootstrap";
import closeIcon from "../assets/images/x.svg";
import { useNavigate } from "react-router-dom";
import {PROFILE_PAGE, TREE_PAGE} from "../util/consts";
import { Context } from "..";
import {addUserDirection, fetchAllDirections, fetchUserDirections, removeUserDirection} from "../util/network";

const UserDirections = (props) => {
    const [directions, setDirections] = useState([]);
    const navigate = useNavigate();
    const { direction } = useContext(Context);
    const userId = props.userId

    const [allDirections, setAllDirections] = useState([])

    useEffect(() => {
        fetchUserDirections(userId).then(dirs => setDirections(dirs))
        fetchAllDirections().then(dirs => setAllDirections(dirs))
    }, []);

    // useEffect(() => {
    //     console.log("save dir");
    //     localStorage.setItem("UserDirections", JSON.stringify(directions));
    // }, [directions]);

    const addNewDirection = (dirId) => {
        let alreadyExist =
            directions.find((dir) => dir.id === Number(dirId)) !== undefined;
        if (alreadyExist) return;

        let newDirection = allDirections.find(
            (dir) => dir.id === String(dirId)
        );

        console.log(dirId)
        console.log(allDirections)

        setDirections((dirs) => {
            return [...dirs, newDirection];
        });
        addUserDirection(userId, dirId)
    };

    const removeDirection = async (dirId) => {
        setDirections((d) => d.filter((d) => d.id !== dirId));
        removeUserDirection(userId, dirId)
    };

    const openTree = (schema) => {
        if (!schema) return
        direction.setSchema(schema);
        // console.log(schema)
        navigate(TREE_PAGE);
    };

    const AddButton = createAddButton(addNewDirection, allDirections);

    return (
        <div className="directions-container">
            {directions.length === 0 && (
                <p className="m-0" style={{ fontSize: "24px" }}>
                    Добавьте новое направление!
                </p>
            )}
            {directions.map((d) => {
                return (
                  <div style={{position: 'relative'}} key={d.id} className="dir-container">
                      <button
                        onClick={() => openTree(d.schema)}
                        className={"direction " + d.color}
                        key={d.id}
                      >
                          {d.name}
                      </button>
                      <button
                        onClick={() => removeDirection(d.id)}
                        className="del-dir-btn"
                      >
                          <img src={closeIcon} alt="" />
                      </button>
                  </div>
                )
            })}
            {AddButton}
        </div>
    );
};

export default UserDirections;

const createAddButton = (onSelectCallback, allDirections) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <button
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="add-direction-btn"
        >
            +
        </button>
    ));

    const CustomMenu = React.forwardRef(
        ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
            const [value, setValue] = useState("");

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="add-btn-search-field "
                        placeholder="Поиск"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled add-btn-menu-list">
                        {React.Children.toArray(children).filter(
                            (child) =>
                                !value ||
                                child.props.children
                                    .toLowerCase()
                                    .startsWith(value.toLowerCase())
                        )}
                    </ul>
                </div>
            );
        }
    );

    return (
        <Dropdown onSelect={onSelectCallback}>
            <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-custom-components"
            />

            <Dropdown.Menu as={CustomMenu} className="add-btn-menu">
                {allDirections.map((dir) => (
                    <Dropdown.Item key={dir.id} eventKey={dir.id}>
                        {dir.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
