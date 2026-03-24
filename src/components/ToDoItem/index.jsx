import './todo-item.style.css'
import { IconPencil, IconTrash } from "../icons";
import { use } from 'react';
import { TodoContext } from '../TodoProvider/TodoContext';

// o item da função ToDoItem é um componente que representa um item individual da lista de tarefas. Ele recebe um objeto item como prop, que contém as informações do todo, como descrição, data de criação e status de conclusão. O componente utiliza o contexto TodoContext para acessar as funções toggleItemCompleted, removeTodo e selectTodoForEdit, que permitem marcar o item como concluído, remover o item ou selecionar o item para edição, respectivamente. O estilo do item é condicionado ao seu status de conclusão, aplicando a classe 'completed' quando o item estiver marcado como concluído.
export function ToDoItem ({ item }) {
    
    const { toggleItemCompleted, removeTodo, selectTodoForEdit } = use(TodoContext)

    const styles = ['todo-item']
    if (item.completed) {
        styles.push('completed')
    }

    return (
        <li className={styles.join(' ')}>
            <p className="date">
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <div className="details">
                <input type="checkbox" 
                    className="checkbox" 
                    defaultChecked={item.completed} 
                    onClick={() => toggleItemCompleted(item)}
                />
                <p className="description">
                    {item.description}
                </p>
                <div className="actions">
                    <button className="btn" onClick={() => removeTodo(item)}>
                        <IconTrash />
                    </button>
                    <button className="btn" onClick={() => selectTodoForEdit(item)}>
                        <IconPencil />
                    </button>
                </div>
            </div>
        </li>
    )
}