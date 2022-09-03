module.exports = {
    SingleSelect : class DropdownMultiSelect extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                open:false,
                data:{}
            }
            this.color_seq = ['crimson','DarkSlateGrey','dodgerblue']
        }
        componentDidMount(){
            let datadict = {};
            this.props.data.forEach((ele)=>{
                datadict[ele] = 1;
            })
            this.setState({data:datadict})
        }
        updateVal(name){
            if(Object.keys(this.state.data).includes(name)){
                let data = this.state.data;
                let val = data[name];
                if(data[name] < 2){
                    val++
                }else{
                    val = 0
                }
                data[name] = val
                console.log(data)
                this.props.updateFilter(data)
                this.setState({data:data})
            }
        }
        optionComponent(name,value){
            return React.createElement("div",{style:{minWidth:"60px",height:"20px",padding:"4px 8px",whiteSpace:"nowrap",cursor:"pointer"},onClick:()=>this.updateVal(name)},[
                React.createElement("div",{style:{width:"10px",height:"10px",borderRadius:"1.5px",display:"inline-block",background:this.color_seq[value],margin:"7px 7px auto 2px"}}),
                React.createElement("span",{},name),
            ])
        }
        render(){
            return React.createElement("div",{style:{margin:"auto 10px auto 0px",padding:"2px 6px 2px 9px",background:"rgb(32, 34, 37)",color:"var(--text-muted)",position:"relative"}},[
                React.createElement("div",{style:{minWidth:"60px",height:"20px"},onClick:()=>this.setState({open:!this.state.open})},this.props.title),
                React.createElement("div",{style:{minWidth:"",height:(this.state.open)?"":"0px",maxHeight:"200px",position:"absolute",background:"rgb(32, 34, 37)",display:"flex",flexDirection:"column",transition:"0.2s",overflow:"hidden",left:"0px",zIndex:"2000"}},Object.entries(this.state.data).map(([key,val])=>{
                    return this.optionComponent(key,val)
                }))
            ])
        }
    },
    test : ()=>console.log("testing packages")
}