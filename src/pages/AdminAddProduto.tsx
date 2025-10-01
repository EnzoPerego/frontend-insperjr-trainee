import React from 'react'
import AddProductForm from '../components/AddProductForm'

type Props = { categoriaNome: string; titulo: string; redirect: string }

export const AdminAddProduto: React.FC<Props> = ({ categoriaNome, titulo, redirect }) => {
  return <AddProductForm title={titulo} categoriaNome={categoriaNome} onSuccessRedirect={redirect} />
}

export default AdminAddProduto


