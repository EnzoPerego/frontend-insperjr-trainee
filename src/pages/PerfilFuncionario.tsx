import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useAuth } from '../components/AuthContext'
import { apiFetch } from '../utils/api'


const PerfilFuncionario: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [activeSection, setActiveSection] = useState<string>('meu-perfil')
  const [funcionario, setFuncionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nome: '',
    email: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return
      
      if (!user || user.user_type === 'cliente') {
        window.location.href = '/login'
        return
      }

      try {

        const funcionarioData = await apiFetch(`/funcionarios/${user.id}`)
        setFuncionario(funcionarioData)
        setEditForm({
          nome: funcionarioData.nome,
          email: funcionarioData.email
        })

      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError(`Erro ao carregar dados: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  const handleSaveProfile = async () => {
    if (!user || !funcionario) return

    try {
      const response = await apiFetch(`/funcionarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      setFuncionario(response)
      setIsEditing(false)
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil')
    }
  }


  if (authLoading || loading) {
    return (
      <AdminLayout title="Meu Perfil" activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaiserhaus-dark-brown"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Meu Perfil" activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Meu Perfil" activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="space-y-6">


        <div className="bg-white rounded-lg border shadow">
          <div className="p-6">
 
            <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Informações Pessoais
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-kaiserhaus-dark-brown text-white px-4 py-2 rounded-lg hover:bg-kaiserhaus-light-brown transition-colors"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kaiserhaus-dark-brown focus:border-transparent"
                        />
                      </div>


                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setEditForm({
                              nome: funcionario.nome,
                              email: funcionario.email
                            })
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Nome Completo
                          </label>
                          <p className="text-gray-900">{funcionario?.nome}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{funcionario?.email}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            CPF
                          </label>
                          <p className="text-gray-900">{funcionario?.cpf}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Cargo
                          </label>
                          <p className="text-gray-900 capitalize">
                            {funcionario?.status === 'admin' ? 'Administrador' : 
                             funcionario?.status === 'motoboy' ? 'Motoboy' : 
                             'Funcionário'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PerfilFuncionario
