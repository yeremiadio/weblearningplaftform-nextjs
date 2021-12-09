import Admin from "../../../layouts/Admin";
// import { useMediaQuery } from "@chakra-ui/media-query";
import DataTable from "react-data-table-component";
import { Button, IconButton } from "@chakra-ui/button";
// import { DotsVerticalIcon } from "@heroicons/react/solid";
import { fetchWithToken } from "../../../utils/fetcher";
import BlueSpinner from "../../../components/Spinner/BlueSpinner";
import moment from "moment";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/toast";
import DeleteUserModal from "../../../components/Modal/Components/User/DeleteUserModal";
import { Modal } from "../../../components/Modal/Modal";
import ActionsButtonTable from "../../../components/Actions/ActionButtonsTable";
import UpdateUserModal from "../../../components/Modal/Components/User/UpdateUserModal";
import useSWR from "swr";
import AddUserModal from "../../../components/Modal/Components/User/AddUserModal";
import { PlusIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";

const index = () => {
  const auth = useSelector((state) => state.auth);
  const {
    data: users,
    mutate,
    error,
  } = useSWR([`api/users`], (url) => fetchWithToken(url), {
    revalidateOnFocus: false,
  });
  const updateUserModalRef = useRef();
  const deleteUserModalRef = useRef();
  const addUserModalRef = useRef();
  const [selectedIndexData, setIndexData] = useState(0);
  const [selectedData, setSelectedData] = useState();
  const toast = useToast();
  const filteredUsers = users?.filter((item) => item.id !== auth.user.id);
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role.role_name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.created_at).format("L"),
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row) => moment(row.updated_at).format("L"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row, index) => (
        <ActionsButtonTable
          row={row}
          onClick={() => setIndexData(index)}
          updateParent={updateUserModalRef}
          setData={setSelectedData}
          deleteParent={deleteUserModalRef}
        />
      ),
    },
  ];

  const handleChangeSelectRows = ({ selectedRows }) => {
    console.log("Selected Rows: ", selectedRows);
  };
  return (
    <>
      <Modal ref={addUserModalRef}>
        <AddUserModal
          parent={addUserModalRef}
          toast={toast}
          mutate={mutate}
          users={filteredUsers}
        />
      </Modal>
      <Modal ref={deleteUserModalRef}>
        <DeleteUserModal
          id={selectedData?.id}
          userName={selectedData?.name}
          parent={deleteUserModalRef}
          toast={toast}
          mutate={mutate}
          users={filteredUsers}
        />
      </Modal>
      <Modal ref={updateUserModalRef}>
        <UpdateUserModal
          user={selectedData}
          mutate={mutate}
          users={filteredUsers}
          indexData={selectedIndexData}
          parent={updateUserModalRef}
          toast={toast}
        />
      </Modal>
      <div className="bg-section">
        <div className="flex items-center">
          <div>
            <h3 className="font-bold text-xl text-primary">User</h3>
            <p className="font-base tracking-wide text-secondary">
              Kelola semua pengguna kamu disini.
            </p>
          </div>
          <Button
            colorScheme="blue"
            className="mt-2 ml-auto"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => addUserModalRef.current.open()}
          >
            Tambah
          </Button>
        </div>
        {!users ? (
          <BlueSpinner />
        ) : (
          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredUsers}
              pagination
              onSelectedRowsChange={handleChangeSelectRows}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default index;

index.layout = Admin;