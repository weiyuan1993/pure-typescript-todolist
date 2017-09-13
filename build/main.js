var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseTodo = /** @class */ (function () {
    function BaseTodo(todoList) {
        this.list = todoList;
    }
    BaseTodo.prototype.create = function (data) {
        this.list.push(data);
    };
    BaseTodo.prototype["delete"] = function (data) {
        //find the index of deleted item
        var deleteIndex = this.list.indexOf(data);
        this.list.splice(deleteIndex, 1);
    };
    return BaseTodo;
}());
var todoStatus;
(function (todoStatus) {
    todoStatus[todoStatus["done"] = 0] = "done";
    todoStatus[todoStatus["undo"] = 1] = "undo";
})(todoStatus || (todoStatus = {}));
var TodoList = /** @class */ (function (_super) {
    __extends(TodoList, _super);
    function TodoList(todoList) {
        return _super.call(this, todoList) || this;
    }
    TodoList.prototype.done = function (data) {
        data.status = todoStatus.done;
        console.log(data);
    };
    TodoList.prototype.render = function () {
        var doneHtml = '';
        var undoHtml = '';
        this.list.forEach(function (todo) {
            if (todo.status == todoStatus.done) {
                doneHtml += "<li>" + todo.content + "<button class=\"remove-item btn btn-default btn-xs pull-right\"></button></li>";
            }
            else if (todo.status == todoStatus.undo) {
                undoHtml += "<li class=\"ui-state-default\"><div class=\"checkbox\"><label><input type=\"checkbox\" value=\"\" class=\"done\" />" + todo.content + "</label></div></li>";
            }
        });
        document.getElementById('done-items').innerHTML = doneHtml;
        document.getElementById('undoList').innerHTML = undoHtml;
        //caculate the undo task
        var remainUndo = 0;
        this.list.forEach(function (todo) {
            if (todo.status == todoStatus.undo) {
                remainUndo++;
            }
        });
        document.querySelector('.count-todos').innerHTML = remainUndo.toString();
        // remove input value
        document.getElementById('todo-input').value = '';
    };
    TodoList.prototype.init = function () {
        var _this = this;
        var listData = localStorage.todoList_Storage;
        if (!listData) {
            this.list = new Array();
            console.log(this.list);
        }
        else {
            this.list = JSON.parse(listData);
            console.log("print", this.list);
        }
        //關閉時儲存到localStorage
        window.onbeforeunload = function () {
            localStorage.todoList_Storage = JSON.stringify(_this.list);
        };
        // Add todo
        document.getElementById('add-button').addEventListener('click', function () {
            var inputValue = document.getElementById('todo-input').value;
            if (inputValue != '') {
                _this.create({ status: todoStatus.undo, content: inputValue });
                _this.render();
            }
            else {
                alert("Please input the value.");
            }
        });
        //done todo
        document.querySelector('#undoList').addEventListener('change', function (e) {
            var self = e.target;
            var text = self.parentNode.innerText;
            console.log(text);
            if (self.checked) {
                // find the done todo
                console.log("checked");
                var doneItem = _this.list.filter(function (todo) {
                    return text == todo.content;
                })[0];
                _this.done(doneItem);
                _this.render();
            }
        });
        //remove
        document.querySelector('#done-items').addEventListener('click', function (e) {
            var self = e.target;
            var text = self.parentNode.innerText;
            console.log(text);
            var removeItem = _this.list.filter(function (todo) {
                return todo.content == text;
            })[0];
            _this["delete"](removeItem);
            _this.render();
        });
        //all done todo
        document.getElementById('checkAll').addEventListener('click', function () {
            _this.list.forEach(function (todo) {
                todo.status = todoStatus.done;
            });
            _this.render();
        });
        this.render();
    };
    return TodoList;
}(BaseTodo));
var myTodoList = new TodoList([{ status: 1, content: "My first work" }]);
myTodoList.init();
