import React from "react";
import ReactDOM from "react-dom";

class Nav extends React.Component {
	state = {	activeIndex : 0 };

	onItemClick = (event) => {
  	this.setState({
    	activeIndex: event.currentTarget.getAttribute("data-index")
    });
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

	render() {
  	return <div className={this.props.className}>
    {
    	this.props.items.map((item, index) => {
      	const isActive = index == this.state.activeIndex;
      	return <a className={"nav-item nav-link " + (isActive ? "active": "")} data-index={index} key={index} href="#" onClick={this.onItemClick}>{item}</a>
      })
    }
    </div>;
  }
}


const div = <div className="container-fluid">
  <header className="row bg-primary">
    <div className="col-10 offset-1 col-md-8 offset-md-2">
      <nav className="navbar navbar-dark bg-primary navbar-expand">
        <Nav className="navbar-nav" items={["Каталог","Доставка","Гарантии","Контакты"]} />
      </nav>
    </div>
  </header>
  <main className="row">
    <div className="page-content col-10 offset-1 col-md-8 offset-md-2">
      <nav className="breadcrumb">
        <a className="breadcrumb-item" href="#">Каталог</a>
        <a className="breadcrumb-item" href="#">Вентиляция</a>
        <a className="breadcrumb-item" href="#">ПВУ</a>
      </nav>
      <h3>
        ПВУ Turkov ZENIT 350 HECO
      </h3>
      <Nav className="nav nav-tabs" items={["Опиание","Характеристики","Отзывы"]} />
      <div className="row">
        <div className="col-3">
          <img className="img-fluid" src="https://www.codery.school/content/course/lesson3-task-img.png" />
        </div>
        <div className="col-9 ">
          <div>
            Вентиляционная установка с рекуперацией тепла и влаги в легком и универсальном корпусе из вспененного полипропилена предназначена для поддержания климата в жилых помещениях или небольших офисах, магазинах
          </div>
          <div className="button-wrapper border-top">
            <button type="button" className="btn btn-primary">Заказать</button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer className="row">
    <div className="col-10 offset-1 col-md-8 offset-md-2">
      (c) Codery.camp, 2020
    </div>
  </footer>
</div>;

ReactDOM.render(div, document.querySelector("#target"));
