import { useEffect, useState } from "react"
import { TodoContext } from "./TodoContext"
// o Todoprovider é um componente que utiliza o contexto TodoContext para fornecer o estado e as funções relacionadas aos todos para os componentes filhos. Ele gerencia o estado dos todos, a visibilidade do modal de formulário, e as funções para adicionar, remover, editar e marcar os itens como concluídos. O estado dos todos é persistido no localStorage para manter os dados mesmo após recarregar a página.
export const TodoProvider = ({ children }) => {

    const savedTodos = localStorage.getItem('todos')
    const [showDialog, setShowDialog] = useState(false)

    const [todos, setTodos] = useState(savedTodos ? JSON.parse(savedTodos) : [])

    const [selectedTodo, setSelectedTodo] = useState(null)

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    const upsertTodo = (formData) => {
        if (selectedTodo) {
            setTodos(oldState =>
                oldState.map(item =>
                    item.id === selectedTodo.id
                        ? { ...item, description: formData.get('description') }
                        : item
                )
            )
        } else (
            setTodos(oldState => {
                const newTodo = {
                    id: oldState.length + 1,
                    description: formData.get('description'),
                    createdAt: new Date().toISOString(),
                    completed: false
                }
                return [...oldState, newTodo]
            })
        )
        closeTodoFormModal()
    }

    //a função removeTodo recebe um objeto todo e atualiza o estado todos, filtrando o array antigo para remover o item com o mesmo id do todo passado como argumento. O resultado é um novo array que não contém o item removido, e esse novo array é definido como o novo estado de todos usando setTodos.
    const removeTodo = (todo) => {
        setTodos(oldState => oldState.filter(t => t.id != todo.id))
        // aqui o != é usado para comparar os ids, e não os objetos completos, garantindo que o item correto seja removido do estado.
    }

    // aqui a função toggleItemCompleted recebe um objeto todo e atualiza o estado todos, mapeando o array antigo e invertendo o valor da propriedade completed do item que corresponde ao id do todo passado como argumento. O resultado é um novo array com o item atualizado, e esse novo array é definido como o novo estado de todos usando setTodos.
    const toggleItemCompleted = (todo) => {
        setTodos(oldState =>
            oldState.map(item =>
                item.id === todo.id
                    ? { ...item, completed: !item.completed }
                    : item
            )
        )
    }

    const openTodoFormModal = () => {
        setShowDialog(true)
    }

    const closeTodoFormModal = () => {
        setShowDialog(false)
        setSelectedTodo(null)
    }

    const selectTodoForEdit = (todo) => {
        setSelectedTodo(todo)
        openTodoFormModal()
    }

    return <TodoContext value={{
        todos,
        upsertTodo,
        removeTodo,
        toggleItemCompleted,
        openTodoFormModal,
        closeTodoFormModal,
        isModalOpen: showDialog,
        selectTodoForEdit,
        selectedTodo
    }}>
        {children}
    </TodoContext>
}