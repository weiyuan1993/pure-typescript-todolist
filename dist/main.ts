class BaseTodo {
    list:Array<todoItem>;
    constructor(todoList:Array<todoItem>){
        this.list = todoList;
    }
    create(data:todoItem):void{
        this.list.push(data);
    }
    delete(data:todoItem):void{
        //find the index of deleted item
        let deleteIndex = this.list.indexOf(data);
        this.list.splice(deleteIndex,1);
    }
}
// set the interface of todo items
interface todoItem{
    status:todoStatus;
    content:string
}
enum todoStatus{
    done,
    undo
}
class TodoList extends BaseTodo{
    constructor(todoList:Array<todoItem>){
        super(todoList);
    }
    done(data:todoItem){

        data.status = todoStatus.done;
        console.log(data);
    }
    render():void{
        let doneHtml='';
        let undoHtml='';
        this.list.forEach(todo=>{
            if(todo.status == todoStatus.done){
                doneHtml += `<li>${todo.content}<button class="remove-item btn btn-default btn-xs pull-right"></button></li>`;
            }else if(todo.status == todoStatus.undo){
                undoHtml += `<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" class="done" />${todo.content}</label></div></li>` ;
            }
        });
        document.getElementById('done-items').innerHTML = doneHtml;
        document.getElementById('undoList').innerHTML = undoHtml;
        //caculate the undo task
        let remainUndo = 0;
        this.list.forEach(todo=>{if(todo.status==todoStatus.undo){
            remainUndo++;
        }});
        (<HTMLElement><any>document.querySelector('.count-todos')).innerHTML = remainUndo.toString();
        // remove input value
        (<HTMLInputElement>document.getElementById('todo-input')).value = '';
    }
    init():void{
        let listData = localStorage.todoList_Storage;
        if(!listData){
            this.list = new Array<todoItem>();
            console.log(this.list);
        }else{
            this.list = JSON.parse(listData);
            console.log("print",this.list);
        }
        //關閉時儲存到localStorage
        window.onbeforeunload = ()=>{
            localStorage.todoList_Storage = JSON.stringify(this.list);
        }
        // Add todo
        document.getElementById('add-button').addEventListener('click',()=>{
            let inputValue = (<HTMLInputElement>document.getElementById('todo-input')).value;
            if(inputValue!= ''){
                this.create({status:todoStatus.undo,content:inputValue});
                this.render();
            }else{
                alert("Please input the value.");
            }
        });
        //done todo
        document.querySelector('#undoList').addEventListener('change',e=>{
                var self:any = e.target;
                var text = self.parentNode.innerText;
                console.log(text);
                if(self.checked){
                    // find the done todo
                    console.log("checked");
                    var doneItem = this.list.filter(todo=>{
                        return text == todo.content;
                    })[0];
                    this.done(doneItem);
                    this.render();
                } 
        })
        //remove
        document.querySelector('#done-items').addEventListener('click',e=>{

            var self:any = e.target;
            var text = self.parentNode.innerText;
            console.log(text);
            var removeItem = this.list.filter(todo=>{
                return todo.content == text
            })[0];
            this.delete(removeItem);
            this.render();
        })
        //all done todo
        document.getElementById('checkAll').addEventListener('click',()=>{
            this.list.forEach(todo=>{
                todo.status = todoStatus.done;
            })
            this.render();
        })
        this.render();

    }
}

let myTodoList = new TodoList([{status:1,content:"My first work"}]);

myTodoList.init();