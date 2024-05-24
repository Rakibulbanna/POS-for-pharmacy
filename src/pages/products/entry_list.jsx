import { Button, Table, TextInput } from "@mantine/core";
import { useNotification } from "~/hooks/useNotification";
import { useEffect, useRef, useState } from "react";
import { openConfirmModal } from "@mantine/modals";
import { BaseAPI, HTTP } from "~/repositories/base";
import { Link } from "react-router-dom"
import { DataTable } from "mantine-datatable";
import EmptyNotification from "@/utility/emptyNotification";
import EditCreateMinimum from "./edit-create-minimum";
import { useAtom } from "jotai";
import { CurrentPage } from "@/store/entryProduct";

const EntryList = () => {
    const [successNotification] = useNotification();
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState({});
    const [categories, setCategories] = useState([]);

    const [paginationCurrentPage, setPaginationCurrentPage] = useAtom(CurrentPage)
    const [paginationTotal, setPaginationTotal] = useState(0)

    

    useEffect(() => {
        // get categories
        HTTP.get(`${BaseAPI}/categories`).then(res => {
            const cats = res.data.data.map(cat => {
                return {
                    label: cat.name,
                    value: cat.id
                }
            })

            setCategories(cats)
            //     setTimeout(() => {
            //       setIsReady(true)
            //     }, 1);
        }).catch(err => {
            console.log(err);
        })

        //   getProducts()
    }, [])

    const getProducts = () => {
        HTTP.get(`${BaseAPI}/products?for=fill&page=${paginationCurrentPage}`).then(res => {
            setProducts(res.data.data);
            setPaginationTotal(res.data.meta.total)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getProducts();
    }, [])


    const handlePaginationChange = (p) => {
        HTTP.get(`${BaseAPI}/products?for=fill&page=${p}`).then(res => {
            setProducts(res.data.data)
            setPaginationCurrentPage(p)
        }).catch(err => {
            console.log(err)
        })
    }

    const openDeleteModal = (id) =>
        openConfirmModal({
            title: 'Are You Sure!',
            centered: true,
            labels: { confirm: 'Confirm', cancel: "Cancel" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleDelete(id),
        });

    const handleDelete = (id) => {
        HTTP.delete(`${BaseAPI}/products/${id}`).then(res => {
            successNotification("Deleted");
            getProducts();
        }).catch(err => {

        })
    }

    const handleSearch = (v) => {
        HTTP.get(`${BaseAPI}/products?for=fill&name=${v}`).then(res => {
            setProducts(res.data.data);
            setPaginationTotal(res.data.meta.total)
        }).catch(err => {
            console.log(err)
        })
    }
    
    return (
        <>
            {
                Object.keys(editProduct).length > 0 &&
                <EditCreateMinimum
                    categories={categories}
                    editProduct={editProduct}
                    setEditProduct={setEditProduct}
                    handlePaginationChange={handlePaginationChange}
                    paginationCurrentPage={paginationCurrentPage}
                />
            }
            <div className={"flex justify-between "}>
                <div className={"flex gap-4 items-end"}>
                    <TextInput label={"Product Name"} onChange={(e) => handleSearch(e.target.value)} />
                    {/*<Button>Search</Button>*/}
                </div>
                <Link to={"/product-entries/create"}><Button>Create</Button></Link>
            </div>
            <DataTable
                className="h-[calc(100vh-100px)]"
                columns={[
                    {
                        accessor: "id",
                        title: "ID",

                    },
                    {
                        accessor: "name"
                    },

                    {
                        accessor: "category.name",
                        title: "Category Name"
                    },
                    {
                        accessor: "action",
                        title: "Action",
                        render: (record) => (
                            <div>
                                <Button onClick={() => setEditProduct(record)} color={"cyan"}>Edit</Button>
                                <Button onClick={() => openDeleteModal(record.id)} className={"ml-6"} color={"red"} >Delete</Button>
                            </div>
                        )
                    },
                ]}
                records={products}
                page={paginationCurrentPage}
                onPageChange={handlePaginationChange}
                totalRecords={paginationTotal}
                recordsPerPage={10}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={onSelectedRecordsChange}
            />

            {/* <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category.name}</td>
                            <td><Button onClick={() => openDeleteModal(product.id)}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table> */}
        </>
    )
}


export default EntryList