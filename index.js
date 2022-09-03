module.exports = (Plugin, Library) => {
    const {Patcher,Logger,Settings,ReactTools,Modals,DiscordModules} = Library;
    const {ModalRoot, ModalHeader, ModalContent, ModalFooter} = BdApi.findModuleByProps("ModalRoot");
    const React = BdApi.React;

    const svg_patterns = {
        heart:"M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z",
        bookmark:"M17,20 L5,20 C4.45,20 4,19.55 4,19 L4,7 C4,6.45 3.55,6 3,6 C2.45,6 2,6.45 2,7 L2,20 C2,21.1 2.9,22 4,22 L17,22 C17.55,22 18,21.55 18,21 C18,20.45 17.55,20 17,20 Z M20,2 L8,2 C6.9,2 6,2.9 6,4 L6,16 C6,17.1 6.9,18 8,18 L20,18 C21.1,18 22,17.1 22,16 L22,4 C22,2.9 21.1,2 20,2 Z M20,12 L17.5,10.5 L15,12 L15,4 L20,4 L20,12 Z",
        remove:"M49.93,17.33H41.87V12a1.5,1.5,0,0,0-1.5-1.5H23.63a1.5,1.5,0,0,0-1.5,1.5v5.33H14.07a1.5,1.5,0,0,0,0,3H16V48a5.49,5.49,0,0,0,5.49,5.48h21.1A5.49,5.49,0,0,0,48,48V20.33h1.89A1.5,1.5,0,0,0,49.93,17.33ZM25.13,13.5H38.87v3.83H25.13ZM45,48a2.49,2.49,0,0,1-2.49,2.48H21.45A2.49,2.49,0,0,1,19,48V20.33H45Z",
        tick:["M27.494,52.367c-0.793,0-1.558-0.302-2.137-0.848L13.901,40.728c-1.253-1.18-1.312-3.152-0.132-4.405c1.181-1.252,3.153-1.311,4.405-0.132l9.143,8.612l21.076-23.269c1.155-1.276,3.125-1.374,4.401-0.218s1.373,3.126,0.218,4.402L29.804,51.342c-0.562,0.621-1.35,0.989-2.187,1.022C27.576,52.366,27.535,52.367,27.494,52.367z","M64.36,68.213H3.117C1.396,68.213,0,66.819,0,65.097V3.117C0,1.396,1.396,0,3.117,0H64.36c1.722,0,3.116,1.396,3.116,3.117v61.98C67.476,66.819,66.082,68.213,64.36,68.213z M6.233,61.981h55.01V6.233H6.233V61.981z"],
        arrow:"M16.59 8.59003L12 13.17L7.41 8.59003L6 10L12 16L18 10L16.59 8.59003Z",
        plus:"M2.70489,2.70489V125.29511H125.29511V2.70489ZM101.32351,64A9.49791,9.49791,0,0,1,91.838,73.48554H73.48554v18.349a9.48554,9.48554,0,1,1-18.97107,0v-18.349H36.162a9.48726,9.48726,0,0,1,0-18.97451H54.51446V36.162a9.48554,9.48554,0,1,1,18.97107,0V54.511H91.838a9.45393,9.45393,0,0,1,9.48552,9.36181Z",
        cross:"M70.7,64.3c1.8,1.8,1.8,4.6,0,6.4c-0.9,0.9-2,1.3-3.2,1.3c-1.2,0-2.3-0.4-3.2-1.3L46,52.4L27.7,70.7c-0.9,0.9-2,1.3-3.2,1.3s-2.3-0.4-3.2-1.3c-1.8-1.8-1.8-4.6,0-6.4L39.6,46L21.3,27.7c-1.8-1.8-1.8-4.6,0-6.4c1.8-1.8,4.6-1.8,6.4,0L46,39.6l18.3-18.3c1.8-1.8,4.6-1.8,6.4,0c1.8,1.8,1.8,4.6,0,6.4L52.4,46L70.7,64.3z",
        refresh:"M63.22,22.34a2.57,2.57,0,0,0-3.62.06l-3.39,3.52a28.13,28.13,0,1,0-7.94,21.95,2.56,2.56,0,0,0-3.66-3.58,23,23,0,1,1,6.47-18.45l-3.19-3.19a2.56,2.56,0,1,0-3.62,3.62L52,34a2.56,2.56,0,0,0,1.81.75h0a2.56,2.56,0,0,0,1.82-.79L63.28,26A2.57,2.57,0,0,0,63.22,22.34Z"
    }

    const range_value_list = ["Touch","Special","Self","Self (10-foot radius)","Self (10-foot-radius sphere)","Self (15-foot radius)","Self (15-foot cube)","Self (15-foot cone)","Self (60-foot cone)","10 feet","30 feet","60 feet","90 feet","120 feet","150 feet","300 feet","500 feet","1 mile"]
    const casttime_value_list = ["1 bonus action","1 reaction","1 action","1 minute","10 minutes","24 hours"]
    const classes_value_list = ['wizard','warlock','paladin','sorcerer','cleric','bard','druid','ranger']
    const schools_value_list = ['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation']
    const duration_type_list = ['instantaneous','round','minute','hour','day','until dispelled']
    const item_types = ['None','Armor','Potions','Equipment','Consumable','Scrolls','Magical','Weapon','Wondrous','Misc','Spl Material','Ammo','Currency','Loot']
    const all_storage_data_names = ['characters','active_character','prepared_spellist','active_prepared_spellist','custom_spellist','spell_favourites','inventory']
    // const duration_values_list = ['instantaneous','1 round','1 minute','10 minutes','1 hour','8 hours','24 hours','1 day','7 days','10 days','30 days','until dispelled']

    var is_window_open_flag = false;
    var keypress_recorder = {};
    
    class NavBar extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                navTab:this.props.defaultNav??""
            }
        }
        navItem(name){
            let active_nav = this.state.navTab == name;
            return React.createElement("div",{style:{width:"95px",height:"24px",background:(active_nav)?"rgb(136 137 140)":"none",borderRadius:"1.5px",textAlign:"center",marginLeft:"4px",fontWeight:"bold",fontSize:"15",lineHeight:"150%",color:(active_nav)?"rgb(32, 34, 37)":"rgb(136 137 140)",transition:"0.2s"},onClick:()=>{this.setState({navTab:name});this.props.setActiveTab(name)}},name)
        }
        render(){
            return React.createElement("div",{style:{width:"100%",height:"24px",background:"rgb(32, 34, 37)",padding:"6px 0px",marginBottom:"6px",display:"flex",flexDirection:"row"}},[
                this.navItem("Spell Search"),
                this.navItem("Character"),
                this.navItem("Spell Book"),
                this.navItem("Inventory"),
                this.navItem("Ex/Import")
            ])
        }
    }

    class SearchBar extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                inputVal:"",
                filter:{component:{},class:"",toggle:true,sortby:"",favourited:false,showNum:50}
            }
            this.handleChange = this.handleChange.bind(this);
        }
        handleChange(val){
            let value = val.target.value
            if(value == "" || value.match(/^[A-Za-z]+$/)){
                this.setState({inputVal:value},this.applyFilter)
            }
        }
        applyFilter(){
            let filtered_results = this.props.spells.filter((ele)=>{
                let value = this.state.inputVal;
                let filter = this.state.filter;
                let component_filter = filter.component;
                if(value != "" && !ele.name.toLowerCase().match(value)){return false}
                if(!filter.toggle){return true}
                if(component_filter && Object.keys(component_filter).length > 0){
                    let internal_filter = true;
                    ['somatic','verbal','material'].forEach((comp)=>{
                        if(!internal_filter){return}
                        if((component_filter[comp] == 2 && !ele.components[comp])){
                            internal_filter = false
                        }
                        if(component_filter[comp] == 0 && ele.components[comp]){
                            internal_filter = false
                        }
                    })
                    if(!internal_filter){return false}
                }
                if(filter.class && filter.class != "none" && !ele.classes.includes(filter.class)){return false}
                if(this.state.filter.favourited && !BdApi.getData('DnDPlugin','spell_favourites')?.includes(ele.name)){return false}
                return true
            })
            if(this.state.filter.sortby){
                if(this.state.filter.sortby == "level"){
                    filtered_results.sort((a,b)=>{return a.level - b.level})
                }
                if(this.state.filter.sortby == "name"){
                    filtered_results.sort((a,b)=>{return (a['name'] > b['name']) - (a['name'] < b['name'])})
                }
                if(this.state.filter.sortby == "level desc"){
                    filtered_results.sort((a,b)=>{return  b.level - a.level})
                }
                if(this.state.filter.sortby == "name desc"){
                    filtered_results.sort((a,b)=>{return  (a['name'] < b['name']) - (a['name'] > b['name'])})
                }
            }
            let sliced_results = filtered_results.slice(0,this.state.filter?.showNum||50);
            this.props.updateFilteredSpells(sliced_results,this.props.setFooter(`showing ${sliced_results.length} out of ${filtered_results.length} results`))
        }
        updateFilter(name,value){
            let filter = this.state.filter;
            if(filter[name] != null){
                filter[name] = value
                this.setState({filter:filter},this.applyFilter)
            }
        }
        render(){
            let search_bar_ele = React.createElement("div",{},[
                // search_title,
                // search_bar,
                React.createElement(TextInput,{onchange:this.handleChange,val:this.state.inputVal,title:this.props.title}),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",marginBottom:"8px",opacity:(this.state.filter.toggle)?"1":"0.4",pointerEvents:(this.state.filter.toggle)?"all":"none"}},[
                    React.createElement(Switch,{defaultToggle:true,update:(val)=>this.updateFilter("toggle",val)}),
                    React.createElement(DropdownMultiSelect,{title:"components",data:['somatic','verbal','material'],updateFilter:(val)=>this.updateFilter("component",val)}),
                    React.createElement(DropdownSingleSelect,{title:"classes",data:classes_value_list,updateFilter:(val)=>this.updateFilter("class",val)}),
                    React.createElement(DropdownSingleSelect,{title:"sort by",data:['name','level','name desc','level desc'],updateFilter:(val)=>this.updateFilter("sortby",val)}),
                    React.createElement("input",{style:{margin:"auto 15px auto 0px",padding:"2px 3px 2px 6px",background:"rgb(32, 34, 37)",color:"var(--text-muted)",width:"40px",height:"20px",border:"none",tabIndex:"-1"},type:"number",value:this.state.filter.showNum,onChange:(e)=>this.updateFilter('showNum',e.target.value)}),
                    svgIcon("18px",(this.state.filter.favourited)?"rgb(78, 82, 89)":"rgb(32, 34, 37)",svg_patterns['heart'],(e)=>this.updateFilter('favourited',!this.state.filter.favourited))
                ])
            ])
            return search_bar_ele
        }
    }

    class TextInput extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            return React.createElement("div",{},[
                React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"550",fontStyle:"var(--font-display)",color:"var(--header-secondary)",textTransform:"uppercase"}},this.props.title),
                React.createElement("div",{},React.createElement("input",{type:"text",tabIndex:"10",value:this.props.val,onChange:this.props.onchange,style:{
                    width:"96%",
                    height:"25px",
                    margin:"5px auto 10px auto",
                    background:"#202225",
                    padding:"10px",
                    borderRadius:"3px",
                    border:"none",
                    color:"#caccce",
                    fontSize:"16px",
                    fontStyle:"var(--font-primary)"
                }}))
            ])
        }
    }

    class TagSearchInput extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                input_val:"",
                hover_item:null,
                // tags:[],
            }
            this.inputRef = React.createRef();
            this.onTagUpdate = this.onTagUpdate.bind(this);
        }
        tagItem(name){
            return React.createElement("div",{style:{display:"flex",flexDirection:"row",padding:"4px 8px",height:"16px",background:"#4f5660",fontSize:"14px",color:"rgb(202, 204, 206)",margin:"auto 4px auto 2px",cursor:"pointer"}},[
                React.createElement("div",{style:{marginRight:"4px"}},name),
                svgIcon("14px","#37393e",svg_patterns['cross'],()=>{this.onTagUpdate(this.props.tags.filter(ele=>!(name == ele)))},"0 0 90 90")
            ])
        }
        onTagUpdate(tags){
            this.props.onChange(tags)
        }
        render(){
            let filtered_options = this.props.values.filter(ele=>!this.props.tags.includes(ele) && ele.match(this.state.input_val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            let input_style = {border:"none",padding:"1% 2%",fontSize:"14px",background:"rgb(32, 34, 37)",boxSizing:"border-box",color:"rgb(202, 204, 206)",width:"100%"}
            return React.createElement("div",{style:{width:"100%",boxSizing:"border-box",padding:"6px 5px",position:"relative",background:"rgb(32, 34, 37)"}},[
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap",rowGap:"4px"}},[
                    ...[this.props.tags.map(ele=>this.tagItem(ele))],
                    React.createElement("input",{ref:this.inputRef,value:this.state.input_val,onChange:(e)=>this.setState({input_val:e.target.value}),onKeyDown:(e)=>{
                        if(e.keyCode == 8 && this.state.input_val == ""){
                            let tags = this.props.tags;
                            tags.pop();
                            this.onTagUpdate(tags);
                        }
                        // if(e.keyCode == 40){
                        //     let hover_index = filtered_options.indexOf(this.state.hover_item)
                        //     this.setState({hover_item:(hover_index < 0)?filtered_options[0]:filtered_options[hover_index + 1]})
                        // }
                    },style:{...input_style,flex:"1",padding:"1% 0px",minWidth:"50px"}})
                ]),
                (this.state.input_val.length > 0)?React.createElement("div",{style:{width:"100%",maxHeight:"140px",position:"absolute",left:"0px",background:"#27292d",overflowY:"auto",zIndex:"10"},className:"auto-2K3UW5"},filtered_options.map(ele=>{
                    return React.createElement("div",{style:{color:"#caccce",width:"100%",padding:"10px 2%",boxSizing:"border-box",cursor:"pointer",background:(this.state.hover_item == ele)?"#323437":"none"},onMouseEnter:()=>this.setState({hover_item:ele}),onMouseLeave:()=>this.setState({hover_item:null}),onClick:()=>{
                        this.setState({input_val:""},this.onTagUpdate([...this.props.tags,ele]));
                        this.inputRef.current.focus()
                    }},ele)
                })):null
            ])
        }
    }

    class Dropdown extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                dropdown:false,
                label:this.props.values.find(ele=>ele.value == this.props.default)?.label || "",
                dynamicItemText:""
            }
        }
        handleChange(ele){
            this.setState({label:this.props.values.find(data=>data.value === ele.value).label},this.props.onchange(ele.value))
        }
        handleDynamicItem(){
            this.props.dynamicItemCallback(this.state.dynamicItemText)
            this.setState({dynamicItemText:""})
        }
        render(){
            let dropdown_items = (this.props.values||[]).map((ele,i)=>{
                return React.createElement("div",{style:{width:"100%",height:"24px",background:(this.state.label == ele.label)?"#2f3135":"#27292d",padding:(this.props.slim)?"5px 0px 2px":"11px 0px 5px 0px",textIndent:"8px"},onClick:()=>{this.handleChange(ele)}},ele.label)
            })
            let dynamic_item = React.createElement("div",{style:{width:"100%",height:"24px",background:"#27292d",padding:(this.props.slim)?"3px 0px 4px":"11px 0px 5px 0px",textIndent:"8px",display:"flex",flexDirection:"row"},onClick:(e)=>e.stopPropagation()},[
                React.createElement("input",{type:"text",placeholder:"Enter new entry",value:this.state.dynamicItemText,style:{width:"90%",height:"80%",border:"none",background:"#202225",color:"#caccce",borderBottom:"2px solid rgb(136, 137, 140)",fontSize:"16px",textIndent:"5px",marginLeft:"6px"},onChange:(e)=>this.setState({dynamicItemText:e.target.value})}),
                React.createElement("div",{style:{marginTop:"3px"}},svgIcon("18px","#caccce",svg_patterns['plus'],()=>this.handleDynamicItem(),"0 0 120 120"))
            ])
            return React.createElement("div",{},[
                React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"550",fontStyle:"var(--font-display)",color:"var(--header-secondary)",textTransform:"uppercase"}},this.props.title),
                React.createElement("div",{},React.createElement("div",{onClick:()=>{this.setState({dropdown:!this.state.dropdown})},style:{width:"96%",height:"23px",margin:"5px auto 10px auto",zIndex:"10",background:"#202225",padding:(this.props.slim)?"2px 10px":"10px",borderRadius:"3px",color:"#caccce",fontSize:"16px",fontStyle:"var(--font-primary)",display:"flex",flexDirection:"row",cursor:"pointer",position:"relative"}},[
                    React.createElement("div",{style:{width:"95%",margin:"auto 0"}},this.state.label),
                    svgIcon("24px","#caccce",svg_patterns['arrow'],()=>{},"0 0 24 24"),
                    (this.state.dropdown)?React.createElement("div",{style:{position:"absolute",top:(this.props.slim)?"27px":"43px",left:"0px",width:"100%",maxHeight:"300px",overflowY:"auto"},className:"auto-2K3UW5"},[...dropdown_items,(this.props.dynamic)?dynamic_item:null]):null
                ]))
            ])
        }
    }

    class ModeSelectorOption extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            let label = this.props.label;
            let mode = this.props.mode;
            let color = (label == mode)?"":"rgb(136, 137, 140)";
            let background = (label == mode)?"rgb(136, 137, 140)":"";
            return React.createElement("div",{style:{minWidth:"40px",padding:"2px 6px",color,textAlign:"center",background,borderRadius:"2px"},onClick:()=>{this.props.onchange(label)}},label)
        }
    }

    class DropdownMultiSelect extends React.Component{
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
                this.props.updateFilter(data)
                this.setState({data:data})
            }
        }
        optionComponent(name,value){
            return React.createElement("div",{style:{minWidth:"30px",height:"20px",padding:"4px 8px",whiteSpace:"nowrap",cursor:"pointer"},onClick:()=>this.updateVal(name)},[
                React.createElement("div",{style:{width:"10px",height:"10px",borderRadius:"1.5px",display:"inline-block",background:this.color_seq[value],margin:"7px 7px auto 2px"}}),
                React.createElement("span",{},name),
            ])
        }
        render(){
            return React.createElement("div",{style:{margin:"auto 10px auto 0px",padding:"2px 9px 2px 9px",background:"rgb(32, 34, 37)",color:"var(--text-muted)",position:"relative"}},[
                React.createElement("div",{style:{minWidth:"30px",height:"20px"},onClick:()=>this.setState({open:!this.state.open})},this.props.title),
                React.createElement("div",{className:"none-2-_0dP",style:{minWidth:"",height:(this.state.open)?"":"0px",maxHeight:"240px",position:"absolute",background:"rgb(32, 34, 37)",display:"flex",flexDirection:"column",transition:"0.2s",overflow:"hidden scroll",left:"0px",zIndex:"2000"}},Object.entries(this.state.data).map(([key,val])=>{
                    return this.optionComponent(key,val)
                }))
            ])
        }
    }

    class DropdownSingleSelect extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                open:false,
                selected:"none"
            }   
        }
        updateVal(name){
            this.setState({selected:name,open:false},()=>this.props.updateFilter(name))
        }
        optionComponent(name){
            return React.createElement("div",{style:{minWidth:"30px",height:"20px",padding:"4px 8px",whiteSpace:"nowrap",cursor:"pointer",background:(this.state.selected == name)?"rgb(49,52,56)":"rgb(32,34,37)"},onClick:()=>this.updateVal(name)},React.createElement("span",{},name))
        }
        render(){
            return React.createElement("div",{style:{margin:"auto 10px auto 0px",padding:"2px 9px 2px 9px",background:"rgb(32, 34, 37)",color:"var(--text-muted)",position:"relative"}},[
                React.createElement("div",{style:{minWidth:"30px",height:"20px"},onClick:()=>this.setState({open:!this.state.open})},this.props.title),
                React.createElement("div",{style:{minWidth:"",height:(this.state.open)?"":"0px",maxHeight:"200px",position:"absolute",background:"rgb(32, 34, 37)",display:"flex",flexDirection:"column",transition:"0.2s",overflow:"hidden",left:"0px",zIndex:"2000"}},['none',...this.props.data].map((ele)=>{
                    return this.optionComponent(ele)
                }))
            ])
        }
    }

    class Switch extends React.Component{
        constructor(props){
            super(props);
            this.state = {toggle:this.props.defaultToggle||false}
            this.handleClick = this.handleClick.bind(this);
        }
        handleClick(){
            this.setState({toggle:!this.state.toggle},()=>this.props.update(this.state.toggle))
        }
        render(){
            return React.createElement("div",{style:{width:"32px",height:"14px",background:(this.state.toggle)?"#29ab87":"rgb(32,34,37)",border:"5px solid rgb(32,34,37)",borderRadius:"1px",transition:"0.4s",position:"relative",marginRight:"10px",pointerEvents:"all"},onClick:this.handleClick},React.createElement("div",{style:{width:"14px",height:"14px",background:"var(--text-muted)",marginLeft:(this.state.toggle)?"50%":"0%",transition:"0.2s",borderRadius:"1px",padding:"2px",position:"absolute",top:"-2px",boxShadow:"0.5px 0.5px #222"}}))
        }
    }

    function svgIcon(width = "18px",color = "rgb(78, 82, 89)",pattern = svg_patterns['heart'],on_click = ()=>{},vb="0 0 512 512"){
        if(!Array.isArray(pattern)){
            return React.createElement("svg",{onClick:on_click,xmlns:"http://www.w3.org/2000/svg",viewBox:vb,style:{width:width,fill:color}},React.createElement("path",{d:pattern}))
        }else{
            return React.createElement("svg",{onClick:on_click,xmlns:"http://www.w3.org/2000/svg",viewBox:vb,style:{width:width,fill:color}},pattern.map(ele=>React.createElement("path",{d:ele})))
        }
    }

    class SpellCard extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                bodyOpen:false,
                favourited:Boolean(BdApi.getData('DnDPlugin','spell_favourites')?.includes(this.props.data.name)),
                inSpellBook:Boolean(BdApi.getData('DnDPlugin','spellbook')?.[BdApi.getData('DnDPlugin','active_character')]?.includes(this.props.data.name)),
                inPreparedSpells:Boolean((BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]?.character == BdApi.getData('DnDPlugin','active_character')) && (BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]?.spells?.includes(this.props.data.name)))
            }
            this.favouriteSpell = this.favouriteSpell.bind(this);
        }
        spellComponent(name){
            return React.createElement("div",{style:{margin:"auto 4px",width:"20px",height:"20px",background:"#4e5259",borderRadius:"3px"}},name)
        }
        attributeLabel(name,value,full=false){
            return React.createElement("div",{style:{width:full?"99%":"49%",padding:"2px 0px 0px 0px",textIndent:"5px",color:"var(--header-secondary)"}},[
                React.createElement("b",{style:{display:"inline-block",width:"80px",background:"#292b2e",borderRadius:"2px",padding:"2px 4px 2px 1px",margin:"0px 8px 1px 0px"}},name),
                React.createElement("span",{},value),
            ])
        }
        descriptionComponent(description){
            return React.createElement("div",{style:{width:"96%",height:"150px",overflow:"auto",margin:"10px auto 5px auto",color:"var(--text-muted)",fontSize:"17px"},className:"none-2-_0dP"},description)
        }
        getSpellComponents(){
            let component_data = this.props.data.components;
            let components = []
            if(component_data.somatic){components.push("S")};
            if(component_data.verbal){components.push("V")};
            if(component_data.material){components.push("M")};
            return components
        }
        favouriteSpell(e,name){
            e.stopPropagation();
            let favourite_spellist = BdApi.getData('DnDPlugin','spell_favourites')
            if(!favourite_spellist){ favourite_spellist = [] }
            if(favourite_spellist.includes(name)){
                BdApi.setData('DnDPlugin','spell_favourites',favourite_spellist.filter((ele)=>!(ele === name)))
            }else{
                BdApi.setData('DnDPlugin','spell_favourites',[name,...favourite_spellist])
            }
            this.setState({favourited:Boolean(BdApi.getData('DnDPlugin','spell_favourites')?.includes(name))})
        }
        addToSpellBook(e,name){
            e.stopPropagation();
            let known_spellist = BdApi.getData('DnDPlugin','spellbook')||{}
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let active_known_spellist = known_spellist[active_character]||[]
            let isInSpellbookFlag = false
            if(active_known_spellist.includes(name)){
                known_spellist[active_character] = active_known_spellist.filter((ele)=>!(ele === name))
                BdApi.setData('DnDPlugin','spellbook',known_spellist)
            }else{
                known_spellist[active_character] = [name,...active_known_spellist]
                BdApi.setData('DnDPlugin','spellbook',known_spellist)
                isInSpellbookFlag = true
            }
            this.setState({inSpellBook:isInSpellbookFlag})
        }
        addToPreparedSpells(e,name){
            e.stopPropagation();
            let prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{}
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let active_prepared_spellist_id = BdApi.getData('DnDPlugin','active_prepared_spellist')
            let isInPreparedSpellsFlag = false
            
            if(active_prepared_spellist_id){
                let active_prepared_spellist = prepared_spellist[active_prepared_spellist_id]||{character:active_character,name:"spellist",spells:[]}
                if(active_prepared_spellist.spells.includes(name)){
                    active_prepared_spellist.spells.push(name);
                    prepared_spellist[active_prepared_spellist_id].spells = active_prepared_spellist.spells.filter((ele)=>!(ele === name));
                    BdApi.setData('DnDPlugin','prepared_spellist',prepared_spellist)
                }else{
                    active_prepared_spellist.spells.push(name);
                    prepared_spellist[active_prepared_spellist_id] = active_prepared_spellist;
                    BdApi.setData('DnDPlugin','prepared_spellist',prepared_spellist)
                    isInPreparedSpellsFlag = true
                }
                if(this.props.preparedSpellistOnChange){this.props.preparedSpellistOnChange()}
                this.setState({inPreparedSpells:isInPreparedSpellsFlag})
            }else{
                BdApi.showToast("No active prepared spellist",{type:"warn"})
            }
        }
        render(){
            let header = React.createElement("div",{style:{display:"flex",flexDirection:"row",margin:"3px auto",width:"100%",height:"32px",background:"#292b2e",color:"var(--text-muted)",fontSize:"18px"},onClick:()=>this.setState({bodyOpen:!this.state.bodyOpen})},[
                React.createElement("div",{style:{background:"#4e5158",height:"100%",width:"8px"}}),
                React.createElement("div",{style:{width:"3%",margin:"auto 5px",fontSize:"16px",textAlign:"center",opacity:"0.8",fontWeight:"bold",zIndex:"1"}},this.props.data.level),
                React.createElement("div",{style:{width:"55%",height:"20px",margin:"auto 3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},this.props.data.name),
                React.createElement("div",{style:{width:"20%",margin:"auto 6px auto 0px",fontWeight:"bold",display:"flex",flexDirection:"row",fontSize:"13px",textAlign:"center",lineHeight:"150%"}},this.getSpellComponents().map((ele)=>this.spellComponent(ele))),
                svgIcon("18px",(this.state.favourited)?"rgb(78, 82, 89)":"rgb(32, 34, 37)",svg_patterns['heart'],(e)=>this.favouriteSpell(e,this.props.data.name)),
                React.createElement("div",{style:{marginLeft:"4px"}}),
                svgIcon("18px",(this.state.inSpellBook)?"rgb(78, 82, 89)":"rgb(32, 34, 37)",svg_patterns['bookmark'],(e)=>this.addToSpellBook(e,this.props.data.name),"0 0 23 23"),
                React.createElement("div",{style:{marginLeft:"4px"}}),
                (this.props.mode === "spellbook")?(svgIcon("18px",(this.state.inPreparedSpells)?"rgb(78, 82, 89)":"rgb(32, 34, 37)",svg_patterns['tick'],(e)=>this.addToPreparedSpells(e,this.props.data.name),"0 -5 75 75")):null
            ])
            let body = React.createElement("div",{style:{width:"100%",height:(this.state.bodyOpen)?"250px":"0px",transition:"0.2s",overflow:"hidden"}},[
                React.createElement("div",{style:{height:"75px",width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}},[
                    this.attributeLabel("Cast Time",this.props.data.casting_time),
                    this.attributeLabel("Range",this.props.data.range),
                    this.attributeLabel("Duration",this.props.data.duration,true),
                    this.attributeLabel("Materials",(this.props.data.components.materials_needed||[]).join(", "),true),
                    this.attributeLabel("Classes",this.props.data.classes.join(", "),true),
                    this.descriptionComponent(this.props.data.description)
                ])
            ])
            return [
                header,
                body
            ]
        }
    }

    function createUI(){
        DiscordModules.ModalActions.closeAllModals();
        // DiscordModules.ModalActions.openModal((props)=>React.createElement(ModalRoot,{transitionState:props.transitionState},React.createElement(SpellUI)))
        DiscordModules.ModalActions.openModal((props)=>React.createElement(ModalRoot,{transitionState:props.transitionState},React.createElement(UIContainer)))
    }

    class SpellUI extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                spells:[],
                filtered_spells:[],
                footer_text:""
            }
            this.updateFilteredSpells = this.updateFilteredSpells.bind(this);
        }
        componentDidMount(){
            if(this.state.spells.length < 1){
                SpelldataFetchHandler((data)=>{
                    this.setState({spells:data.spells})
                })
            }
        }
        updateFilteredSpells(list){
            this.setState({filtered_spells:list})
        }
        render(){
            return React.createElement("div",{style:{"width":"100%"}},
                [   
                    React.createElement(SearchBar,{updateFilteredSpells:this.updateFilteredSpells,spells:this.state.spells,title:"Search Spells",setFooter:(val)=>this.setState({footer_text:val})}),
                    React.createElement("div",{style:{overflow:"auto",width:"100%",height:"440px"},className:"auto-2K3UW5"},this.state.filtered_spells.map((ele)=>{
                        return React.createElement(SpellCard,{data:ele,key:ele.name})
                    })),
                    React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"bold",color:"var(--header-primary)",marginTop:"8px"}},this.state.footer_text)
                ]
            )
        }
    }

    class CharacterUI extends React.Component{
        constructor(props){
            super(props);
            this.default_character_data = ()=>{
                return {
                    name:"",
                    background:"",
                    background_data:{
                        proficiencies:"",
                        languages:""
                    },
                    experience:{curr:"",next:""},
                    health:{
                        current:{name:"Hit Points",value:0},
                        temp:{name:"Temp Hp",value:0},
                        max:{name:"Max Hp",value:0},
                        saves:{
                            death_saves_fail:{name:"Death Save Fail",value:0},
                            death_saves_success:{name:"Death Save Success",value:0}
                        },
                        hit_dice:{name:"Hit Dice",value:0},
                        hit_dice_max:{name:"Total",value:0},
                    },
                    spellslots:[...Array(9).keys()].map(ele=>{return {curr_slots:0,max_slots:0}}),
                    spelldata:{
                        ability:"",
                        num_prep_spells:"",
                        spell_mod:"",
                        spellsave:"",
                        sorcery_points:{curr_slots:0,max_slots:0}
                    },
                    weapons:[],
                    feats:[],
                    basic:{
                        initiative : {name:"Initiative",value:""},
                        armor_class : {name:"Armor Class",value:""},
                        speed : {name:"Speed",value:""},
                        passive_wisdom : {name:"Passive Wisdom",value:""},
                        proficiency : {name:"Proficiency",value:""}
                    },
                    classes:[],
                    senses:[],
                    movement:[],
                    ability_score:{
                        str : {name:"STR",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            athletics:{name:"Athletics",value:""},
                        }},
                        dex : {name:"DEX",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            acrobatics:{name:"Acrobatics",value:""},
                            slieght_of_hand:{name:"Sleight of Hand",value:""},
                            stealth:{name:"Stealth",value:""},
                        }},
                        wis : {name:"WIS",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            animal_handling:{name:"Animal Handling",value:""},
                            insight:{name:"Insight",value:""},
                            medicine:{name:"Medicine",value:""},
                            perception:{name:"Perception",value:""},
                            survival:{name:"Survival",value:""},
                        }},
                        con : {name:"CON",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                        }},
                        int : {name:"INT",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            arcana:{name:"Arcana",value:""},
                            history:{name:"History",value:""},
                            investigation:{name:"Investigation",value:""},
                            nature:{name:"Nature",value:""},
                            religion:{name:"Religion",value:""},
                        }},
                        cha : {name:"CHA",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            deception:{name:"Deception",value:""},
                            intimidation:{name:"Intimidation",value:""},
                            performance:{name:"Performance",value:""},
                            persuasion:{name:"Persuasion",value:""},
                        }},
                    }
                }
            }
            this.state = {
                character:BdApi.getData('DnDPlugin','active_character')||null,
                mode: "view",
                subMode:0,
                add_character_data:{
                    name:""
                },
                character_data:{
                    name:"",
                    background:"",
                    background_data:{
                        proficiencies:"",
                        languages:""
                    },
                    experience:{curr:"",next:""},
                    health:{
                        current:{name:"Hit Points",value:0},
                        temp:{name:"Temp Hp",value:0},
                        max:{name:"Max Hp",value:0},
                        saves:{
                            death_saves_fail:{name:"Death Save Fail",value:0},
                            death_saves_success:{name:"Death Save Success",value:0}
                        },
                        hit_dice:{name:"Hit Dice",value:0},
                        hit_dice_max:{name:"Total",value:0},
                    },
                    spellslots:[...Array(9).keys()].map(ele=>{return {curr_slots:0,max_slots:0}}),
                    spelldata:{
                        ability:"",
                        num_prep_spells:"",
                        spell_mod:"",
                        spellsave:"",
                        sorcery_points:{curr_slots:0,max_slots:0}
                    },
                    weapons:[],
                    feats:[],
                    basic:{
                        initiative : {name:"Initiative",value:""},
                        armor_class : {name:"Armor Class",value:""},
                        speed : {name:"Speed",value:""},
                        passive_wisdom : {name:"Passive Wisdom",value:""},
                        proficiency : {name:"Proficiency",value:""}
                    },
                    classes:[],
                    senses:[],
                    movement:[],
                    ability_score:{
                        str : {name:"STR",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            athletics:{name:"Athletics",value:""},
                        }},
                        dex : {name:"DEX",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            acrobatics:{name:"Acrobatics",value:""},
                            slieght_of_hand:{name:"Sleight of Hand",value:""},
                            stealth:{name:"Stealth",value:""},
                        }},
                        wis : {name:"WIS",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            animal_handling:{name:"Animal Handling",value:""},
                            insight:{name:"Insight",value:""},
                            medicine:{name:"Medicine",value:""},
                            perception:{name:"Perception",value:""},
                            survival:{name:"Survival",value:""},
                        }},
                        con : {name:"CON",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                        }},
                        int : {name:"INT",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            arcana:{name:"Arcana",value:""},
                            history:{name:"History",value:""},
                            investigation:{name:"Investigation",value:""},
                            nature:{name:"Nature",value:""},
                            religion:{name:"Religion",value:""},
                        }},
                        cha : {name:"CHA",value:"",mod:"",abilityList:{
                            saving_throw:{name:"Saving Throw",value:""},
                            deception:{name:"Deception",value:""},
                            intimidation:{name:"Intimidation",value:""},
                            performance:{name:"Performance",value:""},
                            persuasion:{name:"Persuasion",value:""},
                        }},
                    }
                }
            }
            this.createCharacter = this.createCharacter.bind(this)
            this.handleModeChange = this.handleModeChange.bind(this)
            this.setCharacterData = this.setCharacterData.bind(this)
            this.saveCharacterData = this.saveCharacterData.bind(this)
            this.deleteCharacter = this.deleteCharacter.bind(this)
        }
        componentDidMount(){
            (BdApi.getData("DnDPlugin","characters")||[]).forEach((ele)=>{
                if(ele.id == BdApi.getData("DnDPlugin","active_character")){
                    this.setState({character_data:{...this.state.character_data,...ele}})
                }
            })
        }
        subNavi(){
            return React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",margin:"4px 0px",overflow:"hidden",border:"3px solid #4e535d",borderRadius:"3px",boxSizing:"border-box"}},["Stats","Magic & Feats","Attacks","Background"].map((ele,i)=>{
                let is_active = this.state.subMode == i
                return React.createElement("div",{style:{width:"25%",padding:"4px 0px",textAlign:"center",background:(is_active)?"#4e535d":"",fontSize:"14px",fontWeight:"550",color:(is_active)?"#202225":"#88898c",transition:"0.1s",cursor:"pointer"},onClick:()=>{this.setState({subMode:i})}},ele)
            }))
        }
        tableSection(title,variable_name,val,onchange = (e)=>{}){
            let input_style = {border:"none",padding:"4px",background:"rgb(32, 34, 37)",boxSizing:"border-box",color:"#b4b6b9",width:"100%"}
            let header_style = {textAlign:"left",color:"#dcddde",padding:"3px",boxSizing:"border-box",background:"#4f545c"}
            let cell_style = {textAlign:"left",color:"#dcddde",background:"rgb(32, 34, 37)"}
            return React.createElement("div",{},[
                React.createElement("div",{style:{width:"100%",height:"",display:"flex",flexDirection:"row",margin:"3px 0px"}},[
                    React.createElement("div",{style:{width:"96%",fontSize:"15px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},title),
                    svgIcon("18px","rgb(136, 137, 140)",svg_patterns['plus'],()=>onchange([...val,{name:"",val:""}]),"0 0 120 120")
                ]),
                React.createElement("div",{style:{width:"100%",marginTop:"1px",overflowY:"auto",height:"100px",position:"relative"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",gap:"1px",position:"sticky",top:"0px"}},[
                        React.createElement("div",{style:{...header_style,width:"75%"}},"Name"),
                        React.createElement("div",{style:{...header_style,width:"20%"}},variable_name),
                        React.createElement("div",{style:{...header_style,width:"5%"}},""),
                    ]),
                    (val||[]).map(((ele,i)=>{
                        return React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",gap:"1px",marginBottom:"1px"}},[
                            React.createElement("div",{style:{...cell_style,width:"75%"}},[
                                React.createElement("input",{style:{...input_style},value:ele.name,onChange:(e)=>{
                                    val[i].name = e.target.value
                                    onchange(val)
                                }})
                            ]),
                            React.createElement("div",{style:{...cell_style,width:"20%"}},[
                                React.createElement("input",{style:{...input_style},value:ele.val,onChange:(e)=>{
                                    val[i].val = e.target.value
                                    onchange(val)
                                }})
                            ]),
                            React.createElement("div",{style:{...cell_style,width:"5%"}},[
                                React.createElement("div",{style:{display:"flex",flexDirection:"row",height:"100%",alignItems:"center",paddingLeft:"2px",boxSizing:"2px"}},[
                                    svgIcon("16px","rgb(136, 137, 140)",svg_patterns['cross'],()=>{
                                        val.splice(i,1)
                                        onchange(val)
                                    },"0 0 90 90"),
                                ])
                            ]),
                        ])
                    }))
                ])
            ])
        }
        setCharacterData(dataname,subname,dataval){
            let character_data = this.state.character_data
            character_data[dataname][subname] = dataval
            this.setState({character_data})
        }
        saveCharacterData(){
            if(!BdApi.getData("DnDPlugin","active_character")){return 0}
            let updated_character_data = (BdApi.getData("DnDPlugin","characters")||[]).map((ele)=>{
                if(ele.id == BdApi.getData("DnDPlugin","active_character")){
                    let id = ele.id
                    ele = this.state.character_data
                }
                return ele;
            })
            BdApi.setData("DnDPlugin","characters",updated_character_data)
        }
        componentWillUnmount(){
            this.saveCharacterData()
            return true
        }
        viewUI(){
            let input_style = {border:"none",padding:"4px",background:"rgb(32, 34, 37)",boxSizing:"border-box",color:"#b4b6b9"}
            let showFlag = parseInt(this.state.character) > 0
            return [
                React.createElement(Dropdown,{title:"Character Name",slim:true,default:this.state.character,values:this.getCharacters().map((ele,i)=>{
                    return {label:ele.name,value:ele.id}
                }),onchange:(e)=>{this.setActiveCharacter(e)}}),
                (showFlag)?this.subNavi():null,
                (this.state.subMode == 0 && showFlag)?React.createElement("div",{style:{width:"100%",height:"490px",overflowY:"auto"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{height:"38px",width:"100%",marginBottom:"5px",display:"flex",flexDirection:"row",position:"sticky",top:"0px",background:"rgb(54, 57, 63)",paddingBottom:"6px"}},[
                        ...Object.entries(this.state.character_data.health).slice(0, 3).map(([key,val])=>{
                            return React.createElement("div",{style:{width:"110px",marginRight:"10px"}},[
                                React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},val.name),
                                React.createElement("input",{value:val.value,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['health'][key]['value'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%"}}),
                            ])
                        }),
                        React.createElement("div",{style:{width:"90px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},"Exp Current"),
                            React.createElement("input",{value:this.state.character_data.experience.curr,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['experience']['curr'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        svgIcon("18px","rgb(78, 82, 89)",svg_patterns['refresh'],()=>{
                            let character_data = this.state.character_data;
                            character_data['health']['current']['value'] = character_data['health']['max']['value'];
                            character_data['health']['temp']['value'] = 0;
                            this.setState({character_data});
                        },"0 -20 60 60")
                    ]),
                    React.createElement("div",{style:{height:"38px",width:"100%",marginBottom:"5px",display:"flex",flexDirection:"row",background:"rgb(54, 57, 63)"}},[
                        React.createElement("div",{style:{width:"65px",marginRight:"5px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},"Hit Dice"),
                            React.createElement("input",{value:this.state.character_data.health.hit_dice.value,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['health']['hit_dice']['value'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        React.createElement("div",{style:{width:"40px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},"Total"),
                            React.createElement("input",{value:this.state.character_data.health.hit_dice_max.value,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['health']['hit_dice_max']['value'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        Object.entries(this.state.character_data.health.saves).map(([key,ele])=>{
                            return [
                                React.createElement("div",{style:{width:"110px",marginRight:"10px"}},[
                                    React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},ele.name),
                                    React.createElement("div",{style:{display:"flex",flexDirection:"row",marginTop:"2px"}},[
                                        ...[...Array(3).keys()].map((sub_ele,i,arr)=>{
                                            return [
                                                React.createElement("div",{onClick:()=>{
                                                    let character_data = this.state.character_data;
                                                    character_data['health']['saves'][key]['value'] = i+1;
                                                    this.setState({character_data})
                                                },style:{width:"12px",aspectRatio:"1/1",background:"rgb(54, 57, 63)",border:`6px solid ${(i<ele.value)?"rgb(136, 137, 140)":"rgb(32, 34, 37)"}`,borderRadius:"6px"}}),
                                                (i != arr[arr.length-1])?React.createElement("div",{style:{width:"20px",border:`4px solid ${(i<ele.value - 1)?"rgb(136, 137, 140)":"rgb(32, 34, 37)"}`,background:"black",alignSelf:"center",boxSizing:"border-box"}}):null,
                                            ]
                                        }),
                                    ]),
                                ])
                            ]
                        }),
                        React.createElement("div",{style:{width:"90px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},"Exp Next"),
                            React.createElement("input",{value:this.state.character_data.experience.next,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['experience']['next'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        svgIcon("18px","rgb(78, 82, 89)",svg_patterns['refresh'],()=>{
                            let character_data = this.state.character_data;
                            character_data['health']['saves']['death_saves_fail']['value'] = 0;
                            character_data['health']['saves']['death_saves_success']['value'] = 0;
                            this.setState({character_data});
                        },"0 -20 60 60")
                    ]),
                    React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row"}},[
                        React.createElement("div",{style:{height:"100%",marginRight:"15px"}},[
                            React.createElement("fieldset",{style:{display:"flex",flexDirection:"row",padding:"4px 5px 5px",margin:"0px 0px 5px 0px",border:"2px solid rgb(136, 137, 140)"}},[
                                React.createElement("legend",{style:{color:"rgb(136, 137, 140)",background:"rgb(54, 57, 63)",padding:"0px 5px 0px 2px",fontSize:"16px",fontWeight:"bold"}},"Basic"),
                                React.createElement("div",{style:{width:"100%"}},[
                                    Object.entries(this.state.character_data.basic).map(([key,val])=>{
                                        return [
                                            React.createElement("input",{value:val.value,onChange:(e)=>{this.setCharacterData("basic",key,{name:val.name,value:e.target.value})},style:{width:"80px",fontSize:"38px",fontWeight:"bold",aspectRatio:"1/1",margin:"0",padding:"0",textAlign:"center",...input_style}}),
                                            React.createElement("div",{style:{width:"100%",fontSize:"12px",margin:"3px 0px 8px 0px",padding:"0",color:"rgb(136, 137, 140)",textAlign:"center"}},val.name)
                                        ]
                                    })
                                ])
                            ])
                        ]),
                        React.createElement("div",{style:{width:"390px",height:"100%"}},[
                            Object.entries(this.state.character_data.ability_score).map(([key,val])=>{
                                return [
                                    React.createElement("fieldset",{style:{display:"flex",flexDirection:"row",padding:"4px 5px 5px",margin:"0px 0px 5px 0px",border:"2px solid rgb(136, 137, 140)"}},[
                                        React.createElement("legend",{style:{color:"rgb(136, 137, 140)",background:"rgb(54, 57, 63)",padding:"0px 5px 0px 2px",fontSize:"16px",fontWeight:"bold"}},val.name),
                                        React.createElement("div",{style:{minWidth:"50px",width:"50px"}},[
                                            React.createElement("input",{value:val.value,onChange:(e)=>{
                                                let character_data = this.state.character_data
                                                character_data['ability_score'][key]['value'] = e.target.value
                                                this.setState({character_data})
                                            },style:{width:"100%",fontSize:"30px",fontWeight:"bold",aspectRatio:"1/1",margin:"0",padding:"0",textAlign:"center",...input_style}}),
                                            React.createElement("input",{value:val.mod,onChange:(e)=>{
                                                let character_data = this.state.character_data
                                                character_data['ability_score'][key]['mod'] = e.target.value
                                                this.setState({character_data})
                                            },style:{width:"100%",height:"18px",marginTop:"4px",padding:"0",textAlign:"center",...input_style}}),
                                        ]),
                                        React.createElement("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",marginLeft:"10px",height:"100%",gap:"4px",width:"100%"}},[
                                            Object.entries(val.abilityList).map(([subkey,val])=>{
                                                return React.createElement("div",{style:{height:"20px",width:"48%",display:"flex",flexDirection:"row"}},[
                                                    React.createElement("input",{value:val.value,onChange:(e)=>{
                                                        let character_data = this.state.character_data
                                                        character_data['ability_score'][key]['abilityList'][subkey]['value'] = e.target.value
                                                        this.setState({character_data})
                                                    },style:{...input_style,width:"32px",fontSize:"16px",margin:"0px 3px 0px 0px",padding:"0px",border:"2px solid rgb(136, 137, 140)",textAlign:"center"}}),
                                                    React.createElement("div",{style:{marginLeft:"3px",fontSize:"15px",color:"white",lineHeight:"1.3",cursor:"pointer"}},val.name)
                                                ])
                                            })
                                        ])
                                    ])
                                ]
                            })
                        ])
                    ]),
                    this.tableSection("senses","range",this.state.character_data.senses,(senses)=>this.setState({character_data:{...this.state.character_data,senses}})),
                    this.tableSection("movement","speed",this.state.character_data.movement,(movement)=>this.setState({character_data:{...this.state.character_data,movement}})),
                    this.tableSection("classes","levels",this.state.character_data.classes,(classes)=>this.setState({character_data:{...this.state.character_data,classes}})),
                ]):null,
                (this.state.subMode == 1 && showFlag)?React.createElement("div",{style:{width:"100%",height:"490px",overflowY:"auto"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{width:"100%",margin:"4px 0px"}},[
                        React.createElement("div",{style:{fontSize:"14px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginBottom:"2px"}},"Spell Stats"),
                        React.createElement("div",{style:{width:"100%",borderTop:"1px solid rgb(136, 137, 140)"}},"")
                    ]),
                    React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",marginBottom:"5px"}},[
                        React.createElement("div",{style:{width:"130px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Spellcasting Ability"),
                            React.createElement("input",{value:this.state.character_data.spelldata.ability,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['ability'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        React.createElement("div",{style:{width:"70px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"N Prep Spells"),
                            React.createElement("input",{value:this.state.character_data.spelldata.num_prep_spells,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['num_prep_spells'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        React.createElement("div",{style:{width:"70px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Spell Mod"),
                            React.createElement("input",{value:this.state.character_data.spelldata.spell_mod,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['spell_mod'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        React.createElement("div",{style:{width:"70px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Spellsave DC"),
                            React.createElement("input",{value:this.state.character_data.spelldata.spellsave,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['spellsave'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,fontSize:"15px",width:"100%"}}),
                        ]),
                        React.createElement("div",{style:{width:"80px",overflow:"hidden",borderRadius:"3px",marginRight:"10px"}},[
                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Sorcery Points"),
                            React.createElement("input",{value:this.state.character_data.spelldata.sorcery_points.curr_slots,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['sorcery_points']['curr_slots'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,width:"50%",textAlign:"center",height:"27px",padding:"0"}}),
                            React.createElement("input",{value:this.state.character_data.spelldata.sorcery_points.max_slots,onChange:(e)=>{
                                let character_data = this.state.character_data;
                                character_data['spelldata']['sorcery_points']['max_slots'] = e.target.value;
                                this.setState({character_data});
                            },style:{...input_style,width:"50%",textAlign:"center",height:"27px",padding:"0",background:"rgb(44 46 48)",fontWeight:"bold"}}),
                        ]),
                        svgIcon("18px","rgb(78, 82, 89)",svg_patterns['refresh'],()=>{
                            let character_data = this.state.character_data;
                            character_data['spellslots'] = character_data['spellslots'].map(ele=>{return {curr_slots:ele.max_slots,max_slots:ele.max_slots}});
                            character_data['spelldata']['sorcery_points']['curr_slots'] = character_data['spelldata']['sorcery_points']['max_slots'];
                            this.setState({character_data});
                        },"0 -20 60 60")
                    ]),
                    React.createElement("div",{style:{width:"100%",margin:"4px 0px"}},[
                        React.createElement("div",{style:{fontSize:"14px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginBottom:"2px"}},"Spell Slots"),
                        React.createElement("div",{style:{width:"100%",borderTop:"1px solid rgb(136, 137, 140)"}},"")
                    ]),
                    React.createElement("div",{style:{width:"100%",height:"45px"}},[
                        React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",boxSizing:"border-box"}},[
                            React.createElement("div",{style:{width:"100%"}},[
                                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}},[
                                    this.state.character_data.spellslots.map((ele,i)=>{
                                        return React.createElement("div",{style:{width:"45px",overflow:"hidden",borderRadius:"3px",marginRight:"8px"}},[
                                            React.createElement("div",{style:{fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"4px"}},`Level ${i + 1}`),
                                            React.createElement("input",{value:ele.curr_slots,onChange:(e)=>{
                                                let character_data = this.state.character_data;
                                                character_data['spellslots'][i]['curr_slots'] = e.target.value;
                                                this.setState({character_data});
                                            },style:{...input_style,width:"50%",textAlign:"center",height:"23px",padding:"0",fontSize:"16px"}}),
                                            React.createElement("input",{value:ele.max_slots,onChange:(e)=>{
                                                let character_data = this.state.character_data;
                                                character_data['spellslots'][i]['max_slots'] = e.target.value;
                                                this.setState({character_data});
                                            },style:{...input_style,width:"50%",textAlign:"center",height:"23px",padding:"0",background:"rgb(44 46 48)",fontWeight:"bold",fontSize:"16px"}}),
                                        ])
                                    })
                                ])
                            ]),
                        ])
                    ]),
                    React.createElement("div",{style:{width:"100%",margin:"4px 0px"}},[
                        React.createElement("div",{style:{fontSize:"14px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginBottom:"2px"}},"Feats"),
                        React.createElement("div",{style:{width:"100%",borderTop:"1px solid rgb(136, 137, 140)"}},"")
                    ]),
                    React.createElement("div",{style:{width:"100%",height:"250px",overflowY:"auto"},className:"auto-2K3UW5"},[
                        React.createElement("div",{style:{width:"100%",height:"",display:"flex",flexDirection:"row"}},[
                            React.createElement("div",{style:{width:"95%",fontSize:"15px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},""),
                            svgIcon("18px","rgb(136, 137, 140)",svg_patterns['plus'],()=>this.setState({character_data:{...this.state.character_data,feats:[...this.state.character_data.feats,{name:"",desc:"",use:""}]}}),"0 0 120 120")
                        ]),
                        this.state.character_data.feats.map((ele,i)=>{
                            return React.createElement("div",{style:{wdth:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap",background:"rgb(41, 43, 46)",boxSizing:"border-box",padding:"2px 5px 6px 5px",columnGap:"10px",rowGap:"4px",marginTop:"6px",position:"relative"}},[
                                React.createElement("div",{style:{width:"81%"}},[
                                    React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Name"),
                                    React.createElement("input",{value:ele.name,onChange:(e)=>{
                                        let character_data = this.state.character_data;
                                        character_data['feats'][i]['name'] = e.target.value;
                                        this.setState({character_data});
                                    },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                                ]),
                                React.createElement("div",{style:{width:"10%"}},[
                                    React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Use"),
                                    React.createElement("input",{value:ele.use,onChange:(e)=>{
                                        let character_data = this.state.character_data;
                                        character_data['feats'][i]['use'] = e.target.value;
                                        this.setState({character_data});
                                    },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                                ]),
                                svgIcon("16px","rgb(136, 137, 140)",svg_patterns['cross'],()=>{
                                    let character_data = this.state.character_data;
                                    character_data['feats'].splice(i,1);
                                    this.setState({character_data});
                                },"0 0 90 90"),
                                React.createElement("div",{style:{width:"100%"}},[
                                    React.createElement("div",{style:{width:"93%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Description"),
                                    React.createElement("textarea",{value:ele.desc,onChange:(e)=>{
                                        let character_data = this.state.character_data;
                                        character_data['feats'][i]['desc'] = e.target.value;
                                        this.setState({character_data});
                                    },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)",resize:"none"}})
                                ])
                            ])
                        })
                    ])
                ]):null,
                (this.state.subMode == 2 && showFlag)?React.createElement("div",{style:{width:"100%",height:"490px",overflowY:"auto"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{width:"100%",height:"",display:"flex",flexDirection:"row"}},[
                        React.createElement("div",{style:{width:"95%",fontSize:"15px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Attack List"),
                        svgIcon("18px","rgb(136, 137, 140)",svg_patterns['plus'],()=>this.setState({character_data:{...this.state.character_data,weapons:[...this.state.character_data.weapons,{name:"",mod:"",damage:"",info:"",range:"",weight:""}]}}),"0 0 120 120")
                    ]),
                    this.state.character_data.weapons.map((ele,i)=>{
                        return React.createElement("div",{style:{wdth:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap",background:"rgb(41, 43, 46)",boxSizing:"border-box",padding:"2px 5px 6px 5px",columnGap:"10px",rowGap:"4px",marginTop:"6px",position:"relative"}},[
                            React.createElement("div",{style:{width:"50%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Weapons"),
                                React.createElement("input",{value:ele.name,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['name'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ]),
                            React.createElement("div",{style:{width:"13%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Attack"),
                                React.createElement("input",{value:ele.mod,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['mod'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ]),
                            React.createElement("div",{style:{width:"27%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Damage & Type"),
                                React.createElement("input",{value:ele.damage,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['damage'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ]),
                            svgIcon("16px","rgb(136, 137, 140)",svg_patterns['cross'],()=>{
                                let character_data = this.state.character_data;
                                character_data['weapons'].splice(i,1);
                                this.setState({character_data});
                            },"0 0 90 90"),
                            React.createElement("div",{style:{width:"65%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Info"),
                                React.createElement("input",{value:ele.info,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['info'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ]),
                            React.createElement("div",{style:{width:"15%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Range"),
                                React.createElement("input",{value:ele.range,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['range'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ]),
                            React.createElement("div",{style:{width:"15%"}},[
                                React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Weight"),
                                React.createElement("input",{value:ele.weight,onChange:(e)=>{
                                    let character_data = this.state.character_data;
                                    character_data['weapons'][i]['weight'] = e.target.value;
                                    this.setState({character_data});
                                },style:{...input_style,fontSize:"15px",width:"100%",borderBottom:"2px solid white",padding:"0px",background:"rgb(41, 43, 46)"}})
                            ])
                        ])
                    })
                ]):null,
                (this.state.subMode == 3 && showFlag)?React.createElement("div",{style:{width:"100%",height:"490px",overflowY:"auto"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{width:"100%"}},[
                        React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Name"),
                        React.createElement("input",{value:this.state.character_data.name,onChange:(e)=>{this.setState({character_data:{...this.state.character_data,name:e.target.value}})},style:{...input_style,fontSize:"15px",width:"100%",background:"rgb(41, 43, 46)"}})
                    ]),
                    React.createElement("div",{style:{width:"100%"}},[
                        React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Background"),
                        React.createElement("textarea",{value:this.state.character_data.background,className:"auto-2K3UW5",onChange:(e)=>{this.setState({character_data:{...this.state.character_data,background:e.target.value}})},style:{...input_style,fontSize:"15px",width:"100%",height:"180px",background:"rgb(41, 43, 46)",resize:"none"}})
                    ]),
                    React.createElement("div",{style:{width:"100%"}},[
                        React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Languages"),
                        React.createElement("textarea",{value:this.state.character_data?.background_data?.languages||"",className:"auto-2K3UW5",onChange:(e)=>{
                            let character_data = this.state.character_data;
                            character_data['background_data']['languages'] = e.target.value;
                            this.setState({character_data});
                        },style:{...input_style,fontSize:"15px",width:"100%",height:"44px",background:"rgb(41, 43, 46)",resize:"none"}})
                    ]),
                    React.createElement("div",{style:{width:"100%"}},[
                        React.createElement("div",{style:{width:"100%",fontSize:"12px",fontWeight:"bold",color:"rgb(136, 137, 140)",marginTop:"3px"}},"Proficiencies"),
                        React.createElement("textarea",{value:this.state.character_data?.background_data?.proficiencies||"",className:"auto-2K3UW5",onChange:(e)=>{
                            let character_data = this.state.character_data;
                            character_data['background_data']['proficiencies'] = e.target.value;
                            this.setState({character_data});
                        },style:{...input_style,fontSize:"15px",width:"100%",height:"44px",background:"rgb(41, 43, 46)",resize:"none"}})
                    ]),
                ]):null
            ]
        }
        editUI(){
            let data = this.state.character_data
            return React.createElement("div",{},[
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse",marginTop:"5px"}},[
                    this.button("delete",this.deleteCharacter),
                ])
            ])
        }
        button(label,callback = ()=>{}){
            return React.createElement("div",{style:{padding:"8px 14px",background:"var(--button-secondary-background)",fontWeight:"550",color:"white",margin:"0px 3px",borderRadius:"2px",cursor:"pointer",minWidth:"30px"},onClick:callback},label)
        }
        addUI(){
            let data = this.state.add_character_data
            return React.createElement("div",{},[
                React.createElement(TextInput,{onchange:(e)=>{this.setState({add_character_data:{name:e.target.value}})},val:data.name,title:"Character Name"}),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse"}},[
                    this.button("create",this.createCharacter),
                ])
            ])
        }
        createCharacter(){
            let data = this.state.add_character_data
            let rand_str = Date.now() + '' + Math.floor(Math.random() * 1000)
            // let character = {id:(data['id'])?data['id']:rand_str,name:data.name,...this.state.character_data}
            let character = {...this.default_character_data(),id:rand_str,name:data.name}
            let all_characters = BdApi.getData('DnDPlugin','characters')||[]
            let is_character_check = all_characters.find(ele => character.name == ele.name)
            if(data.name && !is_character_check){
                BdApi.setData('DnDPlugin','characters',[...all_characters,character])
                BdApi.setData('DnDPlugin','active_character',rand_str)
                this.setState({add_character_data:{name:""},character_data:character,character:rand_str})
                BdApi.showToast("Character Created",{type:"success"})
            }else{
                BdApi.showToast("Character Already Exists",{type:"error"})
            }
        }
        deleteCharacter(){
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let characters = [],prepared_spellist = [],spellbook = {},custom_spellist = {},inventory = {};
            (BdApi.getData('DnDPlugin','characters')||[]).forEach(ele=>{(ele.id != active_character)?characters.push(ele):null});
            BdApi.setData('DnDPlugin','characters',characters);
            Object.entries(BdApi.getData('DnDPlugin','prepared_spellist')||{}).forEach(ele=>{(ele[1]?.character != active_character)?prepared_spellist.push(ele):null});
            BdApi.setData('DnDPlugin','prepared_spellist',prepared_spellist);
            Object.entries(BdApi.getData('DnDPlugin','spellbook')||{}).forEach(ele=>{(ele[0] != active_character)?spellbook[ele[0]] = ele[1]:null});
            BdApi.setData('DnDPlugin','spellbook',spellbook);
            Object.entries(BdApi.getData('DnDPlugin','custom_spellist')||{}).forEach(ele=>{(ele[0] != active_character)?custom_spellist[ele[0]] = ele[1]:null});
            BdApi.setData('DnDPlugin','custom_spellist',custom_spellist);
            Object.entries(BdApi.getData('DnDPlugin','inventory')||{}).forEach(ele=>{(ele[0] != active_character)?inventory[ele[0]] = ele[1]:null});
            BdApi.setData('DnDPlugin','inventory',inventory);
            BdApi.setData('DnDPlugin','active_prepared_spellist',null);
            BdApi.setData('DnDPlugin','active_character',null);
            this.setState({character:null})
            BdApi.showToast("Character Deleted",{type:"success"})
        }
        getCharacters(){
            let default_character = {name:"none",id:"0"}
            return [default_character,...(BdApi.getData('DnDPlugin','characters')||[])]
        }
        setActiveCharacter(character_id){
            this.saveCharacterData()
            BdApi.setData('DnDPlugin','active_character',character_id)
            let char_data = null;
            (BdApi.getData("DnDPlugin","characters")||[]).forEach((ele)=>{
                if(ele.id == BdApi.getData("DnDPlugin","active_character")){
                    char_data = ele
                }
            })
            BdApi.setData('DnDPlugin','active_prepared_spellist',null)
            this.setState({character:character_id,character_data:(char_data)?char_data:this.default_character_data()})
        }
        handleModeChange(label){
            this.setState({mode:label})
        }
        render(){
            return React.createElement("div",{style:{"width":"100%"}},
                [   
                    React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse"}},[
                        React.createElement(ModeSelectorOption,{label:"edit",mode:this.state.mode,onchange:this.handleModeChange}),
                        React.createElement(ModeSelectorOption,{label:"add",mode:this.state.mode,onchange:this.handleModeChange}),
                        React.createElement(ModeSelectorOption,{label:"view",mode:this.state.mode,onchange:this.handleModeChange})
                    ]),
                    (this.state.mode == "view")?this.viewUI():null,
                    (this.state.mode == "add")?this.addUI():null,
                    (this.state.mode == "edit")?this.editUI():null,
                ]
            )
        }
    }

    class InventoryUi extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                inventory:BdApi.getData("DnDPlugin","inventory")?.[BdApi.getData("DnDPlugin","active_character")]||[],
                desc_open:[],
                filter:{sort:"",name:"",types:{}},
                filtered_inventory:BdApi.getData("DnDPlugin","inventory")?.[BdApi.getData("DnDPlugin","active_character")]||[]
            }
            this.applyFilter = this.applyFilter.bind(this)
        }
        componentWillUnmount(){
            let active_character = BdApi.getData("DnDPlugin","active_character")
            if(!parseInt(active_character)){return true}
            let inventory_data = (BdApi.getData("DnDPlugin","inventory")||{});
            inventory_data[active_character] = this.state.inventory;
            BdApi.setData("DnDPlugin","inventory",inventory_data)
            return true
        }
        applyFilter(field = null,value = null){
            let curr_filter = this.state.filter;
            if(field){
                curr_filter[field] = value;
            }
            let filtered_results = this.state.inventory;
            if(this.state.filter.name != ""){
                filtered_results = this.state.inventory.map((ele)=>{
                    if(ele.name != "" && !ele.name.toLowerCase().match(this.state.filter.name.trim().toLowerCase())){return false}
                    return ele
                })
            }
            if(Object.keys(this.state.filter.types).length){
                filtered_results = filtered_results.map((ele)=>{
                    let internal_filter = ele;
                    item_types.forEach((type)=>{
                        if(curr_filter.types[type] == 2 && ele.type != type){
                            internal_filter = false
                        }
                        if(curr_filter.types[type] == 0 && ele.type == type){
                            internal_filter = false
                        }
                    })
                    return internal_filter
                })
            }
            this.setState({filter:curr_filter,filtered_inventory:filtered_results});
        }
        render(){
            if(!parseInt(BdApi.getData("DnDPlugin","active_character"))){return null}
            let input_style = {border:"none",padding:"4px",background:"rgb(32, 34, 37)",boxSizing:"border-box",color:"#b4b6b9",width:"100%"}
            let header_style = {textAlign:"left",color:"#dcddde",padding:"3px",boxSizing:"border-box",background:"#4f545c"}
            let cell_style = {textAlign:"left",color:"#dcddde",background:"rgb(32, 34, 37)"}

            let updateInventoryItem = (attr,val,index)=>{
                let inventory = this.state.inventory;
                let filtered_inventory = this.state.filtered_inventory;
                inventory[index][attr] = val 
                filtered_inventory[index][attr] = val
                this.setState({inventory,filtered_inventory});
            }

            return React.createElement("div",{style:{"width":"100%"}},[
                React.createElement("div",{style:{width:"100%",height:"",display:"flex",flexDirection:"row"}},[
                    React.createElement("div",{style:{width:"95%",fontSize:"15px",fontWeight:"bold",color:"rgb(136, 137, 140)"}},[
                        React.createElement("input",{style:{...input_style,width:"220px"},value:this.state.filter.name,onChange:(e)=>this.applyFilter("name",e.target.value)}),
                    ]),
                    React.createElement(DropdownMultiSelect,{title:"components",data:item_types,updateFilter:(val)=>this.applyFilter("types",val)}),
                    svgIcon("18px","rgb(136, 137, 140)",svg_patterns['plus'],()=>{
                        this.setState({inventory:[...this.state.inventory,{name:"",type:"None",weight:"",qty:"",cost:"",desc:""}],filtered_inventory:[...this.state.filtered_inventory,{name:"",type:"None",weight:"",qty:"",cost:"",desc:""}],desc_open:[...this.state.desc_open,false],filter:{...this.state.filter,name:""}})
                    },"0 0 120 120")
                ]),
                React.createElement("div",{style:{width:"100%",borderSpacing:"1px 2px",marginTop:"5px",overflowY:"auto",height:"548px",position:"relative"},className:"auto-2K3UW5"},[
                    React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",gap:"1px",position:"sticky",top:"0px"}},[
                        React.createElement("div",{style:{...header_style,width:"42%"}},"Name"),
                        React.createElement("div",{style:{...header_style,width:"19%"}},"Type"),
                        React.createElement("div",{style:{...header_style,width:"12%"}},"Weight"),
                        React.createElement("div",{style:{...header_style,width:"10%"}},"Qty"),
                        React.createElement("div",{style:{...header_style,width:"10%"}},"Cost"),
                        React.createElement("div",{style:{...header_style,width:"7%"}},""),
                    ]),
                    this.state.filtered_inventory.map((ele,i)=>{
                        return (ele)?[
                            React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",gap:"1px",marginTop:"1px"}},[
                                React.createElement("div",{style:{...cell_style,width:"42%"}},[
                                    React.createElement("input",{style:{...input_style},value:ele.name,onChange:(e)=>updateInventoryItem("name",e.target.value,i)})
                                ]),
                                React.createElement("div",{style:{...cell_style,width:"19%"}},[
                                    React.createElement("select",{style:{...input_style,padding:"4px 0px"},value:ele.type,onChange:(e)=>updateInventoryItem("type",e.target.value,i)},[
                                        ...item_types.map((ele)=>{
                                            return React.createElement("option",{value:ele},ele)
                                        })
                                    ])
                                ]),
                                React.createElement("div",{style:{...cell_style,width:"12%"}},[
                                    React.createElement("input",{style:{...input_style},value:ele.weight,onChange:(e)=>updateInventoryItem("weight",e.target.value,i)})
                                ]),
                                React.createElement("div",{style:{...cell_style,width:"10%"}},[
                                    React.createElement("input",{style:{...input_style},value:ele.qty,onChange:(e)=>updateInventoryItem("qty",e.target.value,i)})
                                ]),
                                React.createElement("div",{style:{...cell_style,width:"10%"}},[
                                    React.createElement("input",{style:{...input_style},value:ele.cost,onChange:(e)=>updateInventoryItem("cost",e.target.value,i)})
                                ]),
                                React.createElement("div",{style:{...cell_style,width:"7%"}},[
                                    React.createElement("div",{style:{display:"flex",flexDirection:"row",height:"100%",alignItems:"center",paddingLeft:"1px",boxSizing:"2px"}},[
                                        svgIcon("16px","rgb(136, 137, 140)",svg_patterns['arrow'],()=>{
                                            let desc_open = this.state.desc_open;
                                            desc_open[i] = !desc_open[i];
                                            this.setState({desc_open});
                                        },"4 4 17 17"),
                                        svgIcon("16px","rgb(136, 137, 140)",svg_patterns['cross'],()=>{
                                            BdApi.showConfirmationModal("Remove Item", 
                                                BdApi.React.createElement("div",{style:{color:"white"}}, [
                                                    React.createElement("span",{},"Remove "),
                                                    React.createElement("b",{},ele.name),
                                                    React.createElement("span",{}," from inventory? This cannot be undone."),
                                                ]),
                                                {
                                                    danger: true,
                                                    confirmText: "Remove",
                                                    cancelText: "Cancel",
                                                    onConfirm:()=>{
                                                        let desc_open = this.state.desc_open, inventory = this.state.inventory, filtered_inventory = this.state.filtered_inventory;
                                                        desc_open.splice(i,1);
                                                        inventory.splice(i,1);
                                                        filtered_inventory.splice(i,1);
                                                        this.setState({desc_open,inventory,filtered_inventory});
                                                    }
                                                }
                                            );
                                        },"0 0 90 90"),
                                    ])
                                ]),
                            ]),
                            (this.state.desc_open[i])?React.createElement("textarea",{style:{...input_style,height:"80px",resize:"none",marginTop:"1px",transition:"0.1s"},placeholder:"description...",value:ele.desc,onChange:(e)=>updateInventoryItem("desc",e.target.value,i)}):null
                        ]:null
                    })
                ])
            ])
        }
    }

    class SpellBookUI extends React.Component{
        constructor(props){
            super(props);
            this.generateCustomClass = ()=>{
                return {
                    name:"",
                    components:{somatic:false,verbal:false,material:false,description:""},
                    description:"",
                    casting_time:casttime_value_list[0],
                    range:range_value_list[0],
                    reaction_text:"",
                    level:0,
                    classes:[],
                    school:schools_value_list[0],
                    concentration:false,
                    ritual:false,
                    duration_type:duration_type_list[0],
                    duration_value:"0"
                }
            }
            this.state = {
                mode: 0,
                spells: [],
                known_spellist: [],
                all_prepared_spellists: BdApi.getData('DnDPlugin','prepared_spellist')||{},
                prepared_spellist: [],
                custom_spellist: BdApi.getData('DnDPlugin','custom_spellist')?.[BdApi.getData('DnDPlugin','active_character')]||{},
                active_custom_spell:null,
                custom_spell_data: this.generateCustomClass()
            }
            this.handleModeChange = this.handleModeChange.bind(this)
            this.updatePreparedSpells = this.updatePreparedSpells.bind(this)
            this.removePreparedSpellist = this.removePreparedSpellist.bind(this)
            this.addNewPreparedSpellist = this.addNewPreparedSpellist.bind(this)
            this.createCustomSpell = this.createCustomSpell.bind(this)
            this.updateCustomSpell = this.updateCustomSpell.bind(this)
        }
        componentDidMount(){
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let all_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{};
            let character_prepared_spellists = {}
            Object.entries(all_prepared_spellist).forEach(([key,val])=>{
                if(val.character == active_character){
                    character_prepared_spellists[key] = val
                }
            })
            let prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]||{}
            if(prepared_spellist.character != active_character){
                BdApi.setData('DnDPlugin','active_prepared_spellist',null)
            }
            SpelldataFetchHandler((data)=>{
                this.setState({spells:data.spells,known_spellist:data.known_spellist,prepared_spellist:data.prepared_spellist,all_prepared_spellists:character_prepared_spellists})
            })
        }
        handleModeChange(label){
            this.setState({mode:label})
        }
        subNavi(){
            return React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",marginTop:"8px",overflow:"hidden",border:"3px solid #4e535d",borderRadius:"3px",boxSizing:"border-box",cursor:"pointer"}},["Prepared","Known","Custom"].map((ele,i)=>{
                let is_active = this.state.mode == i
                return React.createElement("div",{style:{width:"33.3%",padding:"4px 0px",textAlign:"center",background:(is_active)?"#4e535d":"",fontSize:"17px",fontWeight:"550",color:(is_active)?"#202225":"#88898c",transition:"0.1s"},onClick:()=>{this.setState({mode:i})}},ele)
            }))
        }
        button(label,callback = ()=>{}){
            return React.createElement("div",{style:{padding:"8px 14px",height:"15px",background:"var(--button-secondary-background)",fontWeight:"550",color:"white",margin:"0px 3px",borderRadius:"2px",cursor:"pointer",minWidth:"30px"},onClick:callback},label)
        }
        miniSection(title,width,children = null){
            return React.createElement("div",{style:{width,marginTop:"8px"}},[
                React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"550",fontStyle:"var(--font-display)",color:"#7d8490",marginBottom:"4px"}},title),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row"}},children),
            ])
        }
        KnownUI(){
            return React.createElement("div",{style:{width:"100%",height:"515px",overflowY:"auto",marginTop:"8px"},className:"auto-2K3UW5"},this.state.known_spellist.map((ele,i)=>{
                if(ele.length < 1) return;
                return [
                    React.createElement("div",{style:{width:"100%",fontSize:"18px",fontWeight:"bold",color:"#88898c",position:"sticky",top:"0",background:"rgb(54, 57, 63)",padding:"5px 0px",zIndex:"2"}},(i==0)?"Cantrip":`Level ${i}`),
                    (ele||[]).map((sub_ele,i)=>{
                        return React.createElement(SpellCard,{data:sub_ele,key:sub_ele.name,mode:"spellbook",preparedSpellistOnChange:()=>{this.updatePreparedSpells()}})
                    })
                ]
            }))
        }
        updateCustomSpell(del = false){
            let spell_name = this.state.active_custom_spell
            let custom_spellist = BdApi.getData('DnDPlugin','custom_spellist')||{};
            let active_character = BdApi.getData('DnDPlugin','active_character')
            if(custom_spellist?.[active_character]?.[spell_name] && this.state.custom_spell_data.name.length > 0){
                let temp_custom_spellist = custom_spellist[active_character] || {}
                delete temp_custom_spellist[spell_name]
                if(!del){
                    temp_custom_spellist[this.state.custom_spell_data.name] = this.state.custom_spell_data
                    BdApi.showToast("spell updated",{type:"success",timeout:4000})
                }else{
                    BdApi.showToast("spell deleted",{type:"success",timeout:4000})
                }
                custom_spellist[active_character] = temp_custom_spellist
                BdApi.setData('DnDPlugin','custom_spellist',custom_spellist)
                if(del){
                    this.setState({custom_spell_data: { name:"", components:{somatic:false,verbal:false,material:false,description:""}, description:"", casting_time:casttime_value_list[0], range:range_value_list[0], reaction_text:"", level:0, classes:[], school:schools_value_list[0], concentration:false, ritual:false, duration_type:duration_type_list[0], duration_value:"0" }})
                }
                filterValidSpells()
            }
        }
        createCustomSpell(name){
            let custom_spellist = BdApi.getData('DnDPlugin','custom_spellist')||{};
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let temp_custom_spellist = custom_spellist[active_character] || {}
            // let spelldata = this.state.custom_spell_data;
            let spelldata = this.generateCustomClass();
            if(!temp_custom_spellist[name] && name.length > 0){
                spelldata['name'] = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                temp_custom_spellist[name] = spelldata
                custom_spellist[active_character] = temp_custom_spellist
                BdApi.setData('DnDPlugin','custom_spellist',custom_spellist)
                this.setState({custom_spell_data:spelldata,custom_spellist:temp_custom_spellist,active_custom_spell:name})
            }else{
                BdApi.showToast("empty or duplicate custom spell name",{type:"warn",timeout:4000})
            }
        }
        CustomUI(){
            let input_style = {border:"none",padding:"2px 8px",fontSize:"14px",background:"rgb(32, 34, 37)",boxSizing:"border-box",color:"rgb(202, 204, 206)",width:"100%",pointerEvents:(this.state.active_custom_spell)?"auto":"none"};
            let duration_type = this.state.custom_spell_data.duration_type;
            let enable_duration_value = !(duration_type == "instantaneous" || duration_type == "until dispelled" || duration_type == "");
            let spellComponents = Object.entries(this.state.custom_spell_data.components).slice(0,3).map((ele)=>{
                let [name,state] = ele
                return React.createElement("div",{style:{display:"flex",flexDirection:"row",padding:"3px 0px",marginRight:"11px"}},[
                    React.createElement("div",{style:{height:"16px",width:"16px",borderRadius:"2px",border:"3px solid rgb(32, 34, 37)",boxSizing:"border-box",background:(state)?"rgb(61 63 68)":"rgb(32, 34, 37)",margin:"auto 4px auto 0px",transition:"0.1s",cursor:"pointer"},onClick:()=>{
                        let custom_spell_data = this.state.custom_spell_data;
                        custom_spell_data['components'][name] = !custom_spell_data['components'][name];
                        this.setState({custom_spell_data})
                    }}),
                    React.createElement("div",{style:{color:"rgb(202, 204, 206)",fontSize:"15px",lineHeight:"110%"}},name)
                ])
            })
            return [
                React.createElement("div",{style:{marginTop:"8px"}}),
                React.createElement("div",{style:{marginBottom:"10px"}},[
                    React.createElement(Dropdown,{title:"Custom Spells",default:"",dynamicItemCallback:this.createCustomSpell,slim:true,dynamic:true,values:Object.entries(this.state.custom_spellist).map(([key,value],i)=>{
                        return {label:key,value:value}
                    }),onchange:(e)=>{
                        this.setState({custom_spell_data:e,active_custom_spell:e.name})
                    }}),
                    React.createElement("div",{style:{width:"100%",display:"flex",flexWrap:"wrap",opacity:(this.state.active_custom_spell)?"1":"0.5"}},[
                        React.createElement("input",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,name:e.target.value}}),value:this.state.custom_spell_data.name,placeholder:"spell name",style:{border:"none",padding:"1% 2%",fontSize:"16px",background:"rgb(32, 34, 37)",width:"100%",boxSizing:"border-box",color:"rgb(202, 204, 206)",pointerEvents:(this.state.active_custom_spell)?"auto":"none"}}),
                        this.miniSection("Spell Components","100%",[...spellComponents,React.createElement("input",{value:this.state.custom_spell_data.components.description,placeholder:"material description",disabled:!this.state.custom_spell_data.components.material,style:{border:"none",padding:"2px 8px",fontSize:"14px",background:"rgb(32, 34, 37)",width:"270px",boxSizing:"border-box",color:"rgb(202, 204, 206)",opacity:(this.state.custom_spell_data.components.material)?"1.0":"0.55",transition:"0.2s"},onChange:(e)=>{
                            let custom_spell_data = this.state.custom_spell_data;
                            custom_spell_data['components']['description'] = e.target.value;
                            this.setState({custom_spell_data})
                        }})]),
                        this.miniSection("Spell Level","20%",React.createElement("select",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,level:parseInt(e.target.value)}}),value:this.state.custom_spell_data.level,style:input_style},[...Array(10).keys()].map((ele,i)=>{
                            return React.createElement("option",{value:ele,style:{border:"none"}},(ele)?`Level ${ele}`:`Cantrip`)
                        }))),
                        React.createElement("div",{style:{width:"2%"}}),
                        this.miniSection("Range","43%",React.createElement("select",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,range:e.target.value}}),value:this.state.custom_spell_data.range,style:input_style},range_value_list.map((ele,i)=>{
                            return React.createElement("option",{value:ele,style:{border:"none"}},ele)
                        }))),
                        React.createElement("div",{style:{width:"2%"}}),
                        this.miniSection("Casting Time","33%",React.createElement("select",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,casting_time:e.target.value}}),value:this.state.custom_spell_data.casting_time,style:input_style},casttime_value_list.map((ele,i)=>{
                            return React.createElement("option",{value:ele,style:{border:"none"}},ele)
                        }))),
                        this.miniSection("Reaction Text","100%",React.createElement("input",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,reaction_text:e.target.value}}),value:this.state.custom_spell_data.reaction_text,style:{...input_style,padding:"4px 8px",opacity:(this.state.custom_spell_data.casting_time == "1 reaction")?"1.0":"0.55",transition:"0.2s"},placeholder:"eg: which you take when you see a creature within 60 feet of you casting a spell",disabled:!(this.state.custom_spell_data.casting_time == "1 reaction")})),
                        this.miniSection("Classes","100%",React.createElement(TagSearchInput,{values:classes_value_list,tags:this.state.custom_spell_data.classes,onChange:(val)=>{this.setState({custom_spell_data:{...this.state.custom_spell_data,classes:val}})}})),
                        this.miniSection("School","25%",React.createElement("select",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,school:e.target.value}}),value:this.state.custom_spell_data.school,style:input_style},schools_value_list.map((ele,i)=>{
                            return React.createElement("option",{value:ele,style:{border:"none"}},ele)
                        }))),
                        React.createElement("div",{style:{width:"2%"}}),
                        this.miniSection("Duration Type","25%",React.createElement("select",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,duration_type:e.target.value}}),value:this.state.custom_spell_data.duration_type,style:input_style},duration_type_list.map((ele,i)=>{
                            return React.createElement("option",{value:ele,style:{border:"none"}},ele)
                        }))),
                        React.createElement("div",{style:{width:"2%"}}),
                        this.miniSection("Duration Value","18%",React.createElement("input",{onChange:(e)=>this.setState({custom_spell_data:{...this.state.custom_spell_data,duration_value:e.target.value}}),type:"number",value:this.state.custom_spell_data.duration_value,style:{...input_style,padding:"4px 8px",opacity:(enable_duration_value)?"1.0":"0.55",transition:"0.2s"},disabled:!(enable_duration_value)})),
                        React.createElement("div",{style:{width:"2%"}}),
                        this.miniSection("Type","40%",React.createElement("div",{style:{display:"flex",flexDirection:"row",padding:"3px 0px",marginRight:"11px"}},["concentration","ritual"].map(ele=>{
                            return [
                                React.createElement("div",{style:{height:"16px",width:"16px",borderRadius:"2px",border:"3px solid rgb(32, 34, 37)",boxSizing:"border-box",background:(this.state.custom_spell_data[ele])?"rgb(61 63 68)":"rgb(32, 34, 37)",margin:"auto 4px auto 0px",transition:"0.1s",cursor:"pointer"},onClick:()=>{
                                    let custom_spell_data = this.state.custom_spell_data;
                                    custom_spell_data[ele] = !custom_spell_data[ele];
                                    this.setState({custom_spell_data})
                                }}),
                                React.createElement("div",{style:{color:"rgb(202, 204, 206)",fontSize:"15px",lineHeight:"110%",marginRight:"10px"}},ele)
                            ]
                        }))),
                        this.miniSection("Description","100%",React.createElement("textarea",{value:this.state.custom_spell_data.description,onChange:(e)=>{
                            this.setState({custom_spell_data:{...this.state.custom_spell_data,description:e.target.value}})
                        },style:{width:"98%",height:"90px",fontSize:"15px",color:"rgba(136, 137, 140,0.9)",borderRadius:"3px",background:"#202225",resize:"none",border:"none",padding:"1%",pointerEvents:(this.state.active_custom_spell)?"auto":"none"},className:"auto-2K3UW5"}))
                    ]),
                ]),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse"}},[
                    (this.state.custom_spell_data.name)?this.button("Update",()=>{this.updateCustomSpell(false)}):null,
                    (this.state.custom_spell_data.name)?this.button("Delete",()=>{this.updateCustomSpell(true)}):null
                ])
            ]
        }
        updatePreparedSpells(){
            let active_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]?.spells||[];
            let prepared_arr = [[],[],[],[],[],[],[],[],[],[]];
            this.state.spells.forEach((ele,i)=>{
                if(active_prepared_spellist.includes(ele.name)){
                    prepared_arr[ele.level].push(ele)
                }
            })
            this.setState({prepared_spellist:prepared_arr})
        }
        PrepareUI(){
            return [
                React.createElement("div",{style:{marginTop:"8px"}}),
                React.createElement(Dropdown,{title:"Prepared Spellist",default:BdApi.getData('DnDPlugin','active_prepared_spellist')||"",dynamicItemCallback:this.addNewPreparedSpellist,slim:true,dynamic:true,values:Object.entries(this.state.all_prepared_spellists).map(([key,value],i)=>{
                    return {label:value.name,value:key}
                }),onchange:(e)=>{
                    BdApi.setData('DnDPlugin','active_prepared_spellist',e)
                    this.updatePreparedSpells()
                }}),
                React.createElement("div",{style:{width:"100%",height:"460px",overflowY:"auto",marginBottom:"6px"},className:"auto-2K3UW5"},this.state.prepared_spellist.map((ele,i)=>{
                    if(ele.length < 1) return;
                    return [
                        React.createElement("div",{style:{width:"100%",fontSize:"18px",fontWeight:"bold",color:"#88898c",position:"sticky",top:"0",background:"rgb(54, 57, 63)",padding:"5px 0px",zIndex:"2"}},(i==0)?"Cantrip":`Level ${i}`),
                        (ele||[]).map((sub_ele,i)=>{
                            return React.createElement(SpellCard,{data:sub_ele,key:sub_ele.name,mode:"spellbook",preparedSpellistOnChange:()=>{this.updatePreparedSpells()}})
                        })
                    ]
                })),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse"}},[
                    (BdApi.getData('DnDPlugin','active_prepared_spellist'))?this.button("delete",this.removePreparedSpellist):null
                ])
            ]
        }
        removePreparedSpellist(){
            let active_spellist_id = BdApi.getData('DnDPlugin','active_prepared_spellist')
            let all_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{}
            let new_prepared_spellist = {}
            Object.entries(all_prepared_spellist).forEach(ele=>{
                if(ele[0] != active_spellist_id){
                    new_prepared_spellist[ele[0]] = ele[1]
                }
            })
            BdApi.setData('DnDPlugin','prepared_spellist',new_prepared_spellist)
            BdApi.setData('DnDPlugin','active_prepared_spellist',null)
            let curr_prepared_spellist = {}
            Object.entries(BdApi.getData('DnDPlugin','prepared_spellist')||{}).forEach((ele)=>{
                if(ele[1].character === BdApi.getData('DnDPlugin','active_character')){
                    curr_prepared_spellist[ele[0]] = ele[1]
                }
            })
            this.setState({all_prepared_spellists:curr_prepared_spellist})
            this.updatePreparedSpells()
        }
        addNewPreparedSpellist(name){
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let rand_str = Date.now() + '' + Math.floor(Math.random() * 1000)
            let prepared_spellist = {character:active_character,name,spells:[]}
            let all_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{}
            BdApi.setData('DnDPlugin','active_prepared_spellist',rand_str)
            all_prepared_spellist[rand_str] = prepared_spellist
            BdApi.setData('DnDPlugin','prepared_spellist',all_prepared_spellist)
            let new_prepared_spellist = {}
            Object.entries(BdApi.getData('DnDPlugin','prepared_spellist')||{}).forEach((ele)=>{
                if(ele[1].character === active_character){
                    new_prepared_spellist[ele[0]] = ele[1]
                }
            })
            this.setState({all_prepared_spellists:new_prepared_spellist})
            this.updatePreparedSpells()
        }
        render(){
            return React.createElement("div",{style:{"width":"100%"}},
                [   
                    this.subNavi(),
                    (this.state.mode == 0)?this.PrepareUI():null,
                    (this.state.mode == 1)?this.KnownUI():null,
                    (this.state.mode == 2)?this.CustomUI():null,
                ]
            )
        }
    }

    class TextareaInput extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                value:""
            }
        }
        button(label,callback = ()=>{}){
            return React.createElement("div",{style:{padding:"8px 14px",height:"15px",background:"var(--button-secondary-background)",fontWeight:"550",color:"white",margin:"0px 3px",borderRadius:"2px",cursor:"pointer",minWidth:"30px"},onClick:callback},label)
        }
        render(){
            return React.createElement("div",{style:{width:"100%"}},[
                React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"550",fontStyle:"var(--font-display)",color:"var(--header-secondary)",textTransform:"uppercase"}},this.props.title),
                React.createElement("div",{style:{width:"100%",fontSize:"15px",color:"rgba(136, 137, 140,0.9)",margin:"2px 0px 4px 0px"}},this.props.body),
                React.createElement("textarea",{value:this.state.value,onChange:(e)=>this.setState({value:e.target.value}),style:{width:"98%",height:"80px",fontSize:"15px",color:"rgba(136, 137, 140,0.9)",borderRadius:"3px",background:"#202225",resize:"none",border:"none",padding:"1%"},spellcheck:"false",className:"auto-2K3UW5"}),
                React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row-reverse",marginTop:"4px"}},[
                    this.button("Import",()=>this.props.callback(this.state.value))
                ])
            ])
        }
    }

    class ExportUI extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                spells: [],
                known_spellist: [],
                all_prepared_spellists: BdApi.getData('DnDPlugin','prepared_spellist')||{},
                prepared_spellist: [],
                import_options: {
                    "override":true,
                    "additive":false,
                }
            }
            this.exportSpellsToTextblock = this.exportSpellsToTextblock.bind(this)
            this.exportSpellsToJson = this.exportSpellsToJson.bind(this)
            this.importJson = this.importJson.bind(this)
            this.showConfirmation = this.showConfirmation.bind(this)
            this.deleteAllData = this.deleteAllData.bind(this)
            this.exportAllToJson = this.exportAllToJson.bind(this)
            this.exportActiveCharacterToJson = this.exportActiveCharacterToJson.bind(this)
            this.exportCustomSpellsToJson = this.exportCustomSpellsToJson.bind(this)
            this.exportActiveCharacterToTextblock = this.exportActiveCharacterToTextblock.bind(this)
        }
        componentDidMount(){
            SpelldataFetchHandler((data)=>{
                this.setState({spells:data.spells,known_spellist:data.known_spellist,prepared_spellist:data.prepared_spellist})
            })
        }
        button(label,callback = ()=>{}){
            return React.createElement("div",{style:{padding:"8px 14px",height:"15px",background:"var(--button-secondary-background)",fontWeight:"550",color:"white",margin:"0px 3px",borderRadius:"2px",cursor:"pointer",minWidth:"30px"},onClick:callback},label)
        }
        sectionHeader(name){
            return React.createElement("div",{style:{width:"100%",fontSize:"19px",fontWeight:"bold",color:"rgb(225,225,225,0.7)",margin:"8px 0px",textDecoration:"underline",position:"sticky",top:"0px",background:"rgb(54, 57, 63)",zIndex:"1",paddingBottom:"3px"}},name)
        }
        section(title,body,func = ()=>{},button){
            return React.createElement("div",{style:{width:"100%"}},[
                React.createElement("div",{style:{width:"100%",fontSize:"13px",fontWeight:"550",fontStyle:"var(--font-display)",color:"var(--header-secondary)",textTransform:"uppercase"}},title),
                React.createElement("div",{style:{width:"100%",fontSize:"13px",color:"white",display:"flex",flexDirection:"row",margin:"2px 0px 10px 0px"}},[
                    React.createElement("div",{style:{width:"70%",fontSize:"15px",color:"rgba(136, 137, 140,0.9)",marginRight:"2%"}},body),
                    this.button(button,func)
                ])
            ])
        }
        sectionLine(){
            return React.createElement("div",{style:{width:"99.5%",margin:"5px auto",borderTop:"1px solid rgba(136, 137, 140,0.8)",filter:"blur(0.6px)"}})
        }
        exportSpellsToTextblock(prepared = false){
            let exportStr = "";
            ((prepared)?this.state.prepared_spellist:this.state.known_spellist).forEach((ele,i)=>{
                if(ele.length > 0){
                    exportStr += `**${(i)?"Level " + i:"Cantrip"}**\n`;
                    let spell_items = ele.map((spell)=>`${spell.name} (${spell.components.raw})[${spell.casting_time}]`).join("\n") + "\n"
                    exportStr += spell_items;
                }
            })
            DiscordNative.clipboard.copy(exportStr)
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportSpellsToJson(prepared = false){
            let exportFormat = {type:(prepared)?"prepared_spells":"spellbook",data:null}
            if(prepared){
                let active_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]
                if(!active_prepared_spellist){
                    BdApi.showToast("no active prepared spellist",{type:"error"})
                    return
                }
                exportFormat.data = active_prepared_spellist?.spells||[]
                exportFormat.name = active_prepared_spellist?.name||"Empty spellist"
            }else{
                let active_known_spellist = BdApi.getData('DnDPlugin','spellbook')?.[BdApi.getData('DnDPlugin','active_character')]||[]
                exportFormat.data = active_known_spellist
            }
            DiscordNative.clipboard.copy(JSON.stringify(exportFormat))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportInventoryToTextblock(){
            let exportStr = [];
            let inventory = BdApi.getData('DnDPlugin','inventory')?.[BdApi.getData('DnDPlugin','active_character')]||[]
            exportStr = inventory.map((ele,i)=>{
                return `${i+1}. ${ele.name} - ${ele.qty}`;
            })
            DiscordNative.clipboard.copy(exportStr.join('\n'))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportInventoryToJson(){
            let exportFormat = {type:"inventory",data:null}
            if(!parseInt(BdApi.getData('DnDPlugin','active_character'))){
                BdApi.showToast("no active character",{type:"error"})
                return
            }
            let inventory = BdApi.getData('DnDPlugin','inventory')?.[BdApi.getData('DnDPlugin','active_character')]
            exportFormat.data = inventory||[]
            DiscordNative.clipboard.copy(JSON.stringify(exportFormat))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportCustomSpellsToJson(){
            let exportFormat = {type:"custom_spell",data:null}
            let custom_spells = BdApi.getData('DnDPlugin','custom_spellist')?.[BdApi.getData('DnDPlugin','active_character')]
            exportFormat.data = custom_spells||{}
            DiscordNative.clipboard.copy(JSON.stringify(exportFormat))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportAllToJson(){
            let exportFormat = {type:"all_data",data:null}
            exportFormat.data = {
                'characters':BdApi.getData('DnDPlugin','characters'),
                'active_character':BdApi.getData('DnDPlugin','active_character'),
                'prepared_spellist':BdApi.getData('DnDPlugin','prepared_spellist'),
                'spellbook':BdApi.getData('DnDPlugin','spellbook'),
                'active_prepared_spellist':BdApi.getData('DnDPlugin','active_prepared_spellist'),
                'custom_spellist':BdApi.getData('DnDPlugin','custom_spellist'),
                'spell_favourites':BdApi.getData('DnDPlugin','spell_favourites'),
                'inventory':BdApi.getData('DnDPlugin','inventory'),
            }
            DiscordNative.clipboard.copy(JSON.stringify(exportFormat))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportActiveCharacterToTextblock(){
            let active_character = BdApi.getData('DnDPlugin','active_character')
            if(!parseInt(active_character)){
                BdApi.showToast("no active character",{type:"error"})
                return
            }
            let output_string = "";
            let character_data = (BdApi.getData('DnDPlugin','characters')||[]).find(ele=>ele.id == active_character);
            output_string += `\`\`\`${character_data.name}\`\`\`\n`;
            output_string += (character_data?.classes||[]).map(ele=>`${ele.name}(${ele.val})`).join(" ") + ` [${character_data?.experience?.curr||0}xp][${character_data?.experience?.next||0}xp]\n`;
            output_string += `**---Stats---**\n`;
            output_string += `\`Hit Points\`:${character_data.health.max.value}\n`;
            output_string += Object.values(character_data?.basic||{}).map(ele=>`\`${ele.name}\`: ${ele.value}`).join("\n") + "\n";
            output_string += `\`Hit Dice\`:${character_data.health.hit_dice.value}\n`;
            output_string += `\`Total Hit Dice\`:${character_data.health.hit_dice_max.value}\n`;
            output_string += `**---Ability Scores---**\n`;
            output_string += Object.values(character_data?.ability_score||{}).map(ele=>{
                let temp_str = `__${ele.name} (${ele.value})[${ele.mod}]__\n`;
                temp_str += Object.values(ele.abilityList).map(ability=>`\`${ability.name}\`: ${ability.value}`).join(", ")
                return temp_str;
            }).join("\n");
            DiscordNative.clipboard.copy(output_string)
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        exportActiveCharacterToJson(){
            let exportFormat = {type:"active_character",data:null}
            let active_character = BdApi.getData('DnDPlugin','active_character')
            if(!parseInt(active_character)){
                BdApi.showToast("no active character",{type:"error"})
                return
            }
            let characters = [],prepared_spellist = {},spellbook = {},custom_spellist = {},inventory = {};
            (BdApi.getData('DnDPlugin','characters')||[]).forEach(ele=>{(ele.id == active_character)?characters.push(ele):null});
            Object.entries(BdApi.getData('DnDPlugin','prepared_spellist')||{}).forEach(ele=>{(ele[1]?.character == active_character)?prepared_spellist[ele[0]] = ele[1]:null});
            Object.entries(BdApi.getData('DnDPlugin','spellbook')||{}).forEach(ele=>{(ele[0] == active_character)?spellbook[ele[0]] = ele[1]:null});
            Object.entries(BdApi.getData('DnDPlugin','custom_spellist')||{}).forEach(ele=>{(ele[0] == active_character)?custom_spellist[ele[0]] = ele[1]:null});
            Object.entries(BdApi.getData('DnDPlugin','inventory')||{}).forEach(ele=>{(ele[0] == active_character)?inventory[ele[0]] = ele[1]:null});
            exportFormat.data = {characters,prepared_spellist,spellbook,custom_spellist,inventory}
            DiscordNative.clipboard.copy(JSON.stringify(exportFormat))
            BdApi.showToast("copied to clipboard",{type:"info"})
        }
        showConfirmation(name,onConfirm,customWarn = null){
            BdApi.showConfirmationModal("Override existing data", 
                BdApi.React.createElement("div",{style:{color:"white"}}, [
                    React.createElement("span",{},(!customWarn)?"Doing so would override ":customWarn[0]),
                    React.createElement("b",{},name),
                    React.createElement("span",{},(!customWarn)?` data, are you sure?`:customWarn[1]),
                ]),
                {
                    danger: true,
                    confirmText: "Override",
                    cancelText: "Cancel",
                    onConfirm
                }
            );
        }
        importJson(json_string){
            let import_data = {};
            let check = true
            try{
                import_data = JSON.parse(json_string);
            } catch (e) { check = false }
            if(check && import_data.type){
                let data = import_data.data;
                let all_spell_names = this.state.spells.map(ele=>ele.name)
                let active_character = BdApi.getData('DnDPlugin','active_character')
                let import_options = this.state.import_options
                if(import_data.type == "prepared_spells"){
                    if(Array.isArray(data)){
                        this.showConfirmation("Prepared Spells",()=>{
                            if(import_options.additive && !BdApi.getData('DnDPlugin','prepared_spellist')){
                                BdApi.showToast("No active spellist to import to",{type:"error"})
                                return
                            }
                            let valid_spells = []
                            data.forEach(ele=>{
                                if(all_spell_names.includes(ele)){valid_spells.push(ele)}
                            })
                            let all_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{}
                            if(import_options.override){
                                let rand_str = Date.now() + '' + Math.floor(Math.random() * 1000)
                                let prepared_spellist = {character:active_character||"0",name:import_data.name,spells:valid_spells}
                                all_prepared_spellist[rand_str] = prepared_spellist
                            }else if(import_options.additive){
                                let active_id = BdApi.getData('DnDPlugin','active_prepared_spellist')
                                let active_prepared_spellist = all_prepared_spellist[active_id]||{}
                                valid_spells = [... new Set([...active_prepared_spellist.spells,...valid_spells])]
                                let prepared_spellist = {character:active_character||"0",name:active_prepared_spellist.name,spells:valid_spells}
                                all_prepared_spellist[active_id] = prepared_spellist
                            }
                            BdApi.setData('DnDPlugin','prepared_spellist',all_prepared_spellist)
                            BdApi.showToast("Import Successful",{type:"success"})
                        })
                    }
                }else if(import_data.type == "spellbook"){
                    if(Array.isArray(data)){
                        this.showConfirmation("Spellbook",()=>{
                            let valid_spells = []
                            data.forEach(ele=>{
                                if(all_spell_names.includes(ele)){valid_spells.push(ele)}
                            })
                            let all_spellbook = BdApi.getData('DnDPlugin','spellbook')||{}
                            if(import_options.additive){
                                valid_spells = [... new Set([...all_spellbook[active_character],...valid_spells])]
                            }
                            all_spellbook[active_character] = valid_spells;
                            BdApi.setData('DnDPlugin','spellbook',all_spellbook)
                            BdApi.showToast("Import Successful",{type:"success"})
                        })
                    }
                }else if(import_data.type == "inventory"){
                    if(parseInt(active_character) && Array.isArray(data)){
                        this.showConfirmation("Inventory",()=>{
                            let all_inventory = (BdApi.getData('DnDPlugin','inventory')||{});
                            if(import_options.additive){
                                let new_inventory = {}
                                all_inventory[active_character].forEach((ele)=>{
                                    new_inventory[ele.name] = ele 
                                })
                                data.forEach((ele)=>{
                                    if(!new_inventory[ele.name]){
                                        new_inventory[ele.name] = ele
                                    }
                                })
                                all_inventory[active_character] = Object.entries(new_inventory).map(ele=>ele[1])
                            }
                            if(import_options.override){
                                all_inventory[active_character] = data;
                            }
                            BdApi.setData('DnDPlugin','inventory',all_inventory)
                            BdApi.showToast("Import Successful",{type:"success"})
                        })
                    }
                }else if(import_data.type == "all_data"){
                    if(import_options.additive){
                        BdApi.showToast("No additive import available",{type:"error"})
                        return
                    }
                    this.showConfirmation("All",()=>{
                        all_storage_data_names.forEach(ele => {
                            if(data[ele]){
                                BdApi.setData('DnDPlugin',ele,data[ele])
                            }
                        });
                        BdApi.showToast("Data successfully imported",{type:"success"})
                    })
                }else if(import_data.type == "active_character"){
                    if(import_options.additive){
                        BdApi.showToast("No additive import available",{type:"error"})
                        return
                    }
                    this.showConfirmation("add a new character",()=>{
                        let characters = BdApi.getData('DnDPlugin','characters')||[];
                        let prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{};
                        let spellbook = BdApi.getData('DnDPlugin','spellbook')||{};
                        let custom_spellist = BdApi.getData('DnDPlugin','custom_spellist')||{};
                        let inventory = BdApi.getData('DnDPlugin','inventory')||{};
                        //new character id to use across all data imports
                        let rand_str = Date.now() + '' + Math.floor(Math.random() * 1000)
                        if(!data['characters']?.length){
                            BdApi.showToast("import missing character data",{type:"error"})
                            return
                        }
                        if(!characters.find(ele=>ele.name == data['characters'][0]['name'])){
                            data['characters'][0].id = rand_str;
                            BdApi.setData('DnDPlugin','characters',[...characters,...data['characters']])
                        }else{
                            BdApi.showToast("character name already exists",{type:"error"})
                            return
                        }
                        if(data['prepared_spellist'] && Object.entries(data['prepared_spellist'])){
                            Object.entries(data['prepared_spellist']).forEach((ele)=>{
                                let new_rand_str = Date.now() + '' + Math.floor(Math.random() * 1000)
                                ele[1].character = rand_str
                                prepared_spellist[new_rand_str] = ele[1]
                            })
                            BdApi.setData('DnDPlugin','prepared_spellist',prepared_spellist)
                        }
                        if(data['spellbook'] && Object.entries(data['spellbook'])){
                            Object.entries(data['spellbook']).forEach((ele)=>{
                                spellbook[rand_str] = ele[1]
                            })
                            BdApi.setData('DnDPlugin','spellbook',spellbook)
                        }
                        if(data['custom_spellist'] && Object.entries(data['custom_spellist'])){
                            Object.entries(data['custom_spellist']).forEach((ele)=>{
                                custom_spellist[rand_str] = ele[1]
                            })
                            BdApi.setData('DnDPlugin','custom_spellist',custom_spellist)
                        }
                        if(data['inventory'] && Object.entries(data['inventory'])){
                            Object.entries(data['inventory']).forEach((ele)=>{
                                inventory[rand_str] = ele[1]
                            })
                            BdApi.setData('DnDPlugin','inventory',inventory)
                        }
                        BdApi.showToast("character data added",{type:"success"})
                    },["Doing so will "," are you sure?"])
                }else if(import_data.type == "custom_spell"){
                    if(!active_character){return }
                    this.showConfirmation("Existing Custom Spells",()=>{
                        let custom_spells = BdApi.getData('DnDPlugin','custom_spellist')||{}
                        let active_custom_spell = custom_spells[active_character]||{}
                        Object.entries(data).forEach(([key,val])=>{
                            active_custom_spell[key] = val
                        })
                        custom_spells[active_character] = active_custom_spell
                        BdApi.setData('DnDPlugin','custom_spellist',custom_spells)
                        BdApi.showToast("Data successfully imported",{type:"success"})
                    },["this is an additive import and will add to your "," and override existing custom spells with the same name, are you sure?"])
                }else{
                    BdApi.showToast("Incompatible import type",{type:"warn"})
                }
            }else{
                BdApi.showToast("Invalid import format",{type:"warn"})
            }
        }
        deleteAllData(){
            BdApi.showConfirmationModal("Delete existing data", 
                BdApi.React.createElement("div",{style:{color:"white"}}, [
                    React.createElement("span",{},"Doing so would purge "),
                    React.createElement("b",{},"data for all characters"),
                    React.createElement("span",{},` stored in this plugin irreversibly, are you sure?`),
                ]),
                {
                    danger: true,
                    confirmText: "Delete",
                    cancelText: "Cancel",
                    onConfirm:()=>{
                        all_storage_data_names.forEach((ele)=>{
                            BdApi.setData('DnDPlugin',ele,null)
                        })
                        BdApi.showToast("All Data deleted",{type:"success"})
                    }
                }
            );
        }
        render(){
            let importOptions = Object.entries(this.state.import_options).map(([key,val])=>{
                return React.createElement("div",{style:{display:"flex",flexDirection:"row",padding:"3px 0px",marginRight:"11px"}},[
                    React.createElement("div",{style:{height:"16px",width:"16px",borderRadius:"2px",border:"3px solid rgb(32, 34, 37)",boxSizing:"border-box",background:(val)?"rgb(61 63 68)":"rgb(32, 34, 37)",margin:"auto 4px auto 0px",transition:"0.1s",cursor:"pointer"},onClick:()=>{
                        let import_option_state = {}
                        Object.entries(this.state.import_options).forEach((ele)=>{
                            import_option_state[ele[0]] = (ele[0] == key)?true:false;
                        });
                        this.setState({import_options:import_option_state})
                    }}),
                    React.createElement("div",{style:{color:"rgb(202, 204, 206)",fontSize:"15px",lineHeight:"110%"}},key)
                ])
            })
            return React.createElement("div",{style:{width:"100%"}},
                [   
                    React.createElement("div",{style:{width:"100%",height:"570px",overflowY:"auto",marginBottom:"6px",position:"relative"},className:"auto-2K3UW5"},[
                        this.sectionHeader("Export Textblock"),
                        this.section("Active Character Textblock","Formats Active Character Data into a textblock to be used in Discord Text channels. Only applies to the current active prepared spellist.",()=>this.exportActiveCharacterToTextblock(true),"Copy To Clipboard"),
                        this.section("Spellbook Textblock","Formats Spellbook Data into a textblock to be used in Discord Text channels.",()=>this.exportSpellsToTextblock(false),"Copy To Clipboard"),
                        this.section("Prepared Spells Textblock","Formats Prepared Spells Data into a textblock to be used in Discord Text channels. Only applies to the current active prepared spellist.",()=>this.exportSpellsToTextblock(true),"Copy To Clipboard"), 
                        this.section("Inventory Items Textblock","Formats Inventory Data into a text block to be used in Discord Text channels.",()=>this.exportInventoryToTextblock(),"Copy To Clipboard"),
                        this.sectionLine(),
                        this.sectionHeader("Export Json"),
                        this.section("Export Active Character","Exports all data for the current character, used as a backup for a single character in case something goes awry",()=>this.exportActiveCharacterToJson(),"Copy To Clipboard"),
                        this.section("Spellbook Json","Export Spellbook Data as a Json string to be used for data backup, import or sharing purposes.",()=>this.exportSpellsToJson(false),"Copy To Clipboard"),
                        this.section("Prepared Spells Json","Export Prepared Spells Data as a Json string to be used for data backup, import or sharing purposes. Only applies to the current active prepared spellist.",()=>this.exportSpellsToJson(true),"Copy To Clipboard"), 
                        this.section("Export Custom Spells","Exports custom spells of the active character, can be imported to other characters",()=>this.exportCustomSpellsToJson(),"Copy To Clipboard"),
                        this.section("Inventory Items Json","Exports Inventory Data as a Json string to be used for data backup, import or sharing purposes.",()=>this.exportInventoryToJson(),"Copy To Clipboard"),
                        this.sectionLine(),
                        // this.sectionHeader("Active Character"),
                        // this.sectionLine(),
                        this.sectionHeader("All Data"),
                        this.section("Export all Data","Exports all data stored for this plugin. Can be used as a backup, it is recommended that you create a multiple backups just in case",()=>this.exportAllToJson(),"Export all Data"),
                        this.section("Delete all Data","Deletes all data stored for this plugin. Can be used as a reset if an issue occurs, it is recommended that you create a backup before doing so",()=>this.deleteAllData(),"Delete all Data"),
                        this.sectionLine(),
                        this.sectionHeader("Import Json"),
                        React.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"row",marginBottom:"3px",marginTop:"-4px"}},[...importOptions]),
                        React.createElement(TextareaInput,{title:"Data Import",body:"Import Data as a Json string, can be used to import prepared spellist data, spellbook data, custom spells and Inventory. Spellbook data, Custom spell data and Inventory data will clear and override existing data for the active character. Custom Spell data will be added to the total existing spellist.",callback:(e)=>{this.importJson(e)}}),
                        this.sectionLine(),
                    ])
                ]
            )
        }
    }

    class UIContainer extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                activeTab:BdApi.getData('DnDPlugin','active_tab')||"Spell Search"
            }
        }
        componentWillUnmount(){
            is_window_open_flag = false;
            return true;
        }
        tabSwitch(name){
            this.setState({activeTab:name});
            BdApi.setData('DnDPlugin','active_tab',name);
        }
        render(){
            return React.createElement("div",{style:{"width":"500px","height":"630px","background":"#36393f","border-radius":"6px","position":"absolute","top":"-220px","left":"-40px","padding":"15px"}},
                [   
                    React.createElement(NavBar,{defaultNav:BdApi.getData('DnDPlugin','active_tab')||"Spell Search",setActiveTab:(name)=>{this.tabSwitch(name)}}),
                    (this.state.activeTab == "Spell Search")?React.createElement(SpellUI,{}):null,
                    (this.state.activeTab == "Character")?React.createElement(CharacterUI,{}):null,
                    (this.state.activeTab == "Spell Book")?React.createElement(SpellBookUI,{}):null,
                    (this.state.activeTab == "Inventory")?React.createElement(InventoryUi,{}):null,
                    (this.state.activeTab == "Ex/Import")?React.createElement(ExportUI,{}):null,
                ]
            )
        }
    }

    async function fetchJson(url,callback){
        const response = await fetch(url);
        const data = await response.json();
        callback(data);
    }

    function customToLiveAdapter(custom_spelllist){
        return Object.entries(custom_spelllist).map(([key,val])=>{
            let duration_val = ""
            if(!["instantaneous","until dispelled"].includes(val.duration_type)){
                duration_val += (val.concentration)?"Concentration, up to ":"" + `${val.duration_value} `;
            }
            return {
                ...val,
                components:{...val.components,raw:`${(val.components.verbal)?"V, ":""}${(val.components.somatic)?"S, ":""}${(val.components.material)?"M":""} ${(val.components.material && val.components.description)?",(" + val.components.description + ")":""}`},
                casting_time:`${val.casting_time} ${val.reaction_text}`,
                duration:`${duration_val}${val.duration_type}`
            }
        })
    }

    async function SpelldataFetchHandler(callback = ()=>{}){
        fetchJson('https://raw.githubusercontent.com/vorpalhex/srd_spells/master/spells.json',(data)=>{
            data = data.map((ele)=>{
                if(ele.level == "cantrip"){
                    ele.level = 0
                }else{
                    ele.level = parseInt(ele.level)
                }
                return ele
            })
            let known_spellist = BdApi.getData('DnDPlugin','spellbook')||{}
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let active_known_spellist = known_spellist[active_character]||[]
            let active_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')?.[BdApi.getData('DnDPlugin','active_prepared_spellist')]?.spells||[]

            let custom_spells = BdApi.getData('DnDPlugin','custom_spellist')?.[BdApi.getData('DnDPlugin','active_character')]||{}

            //repalce spells with custom ones if their names are the same
            let data_corrected = []
            data.forEach(ele => {
                if(!custom_spells[ele.name]){
                    data_corrected.push(ele)
                }
            });
            data = [...data_corrected,...customToLiveAdapter(custom_spells)]

            let known_arr = [[],[],[],[],[],[],[],[],[],[]];
            let prepared_arr = [[],[],[],[],[],[],[],[],[],[]];
            data.forEach((ele,i)=>{
                if(active_known_spellist.includes(ele.name)){
                    known_arr[ele.level].push(ele)
                }
                if(active_prepared_spellist.includes(ele.name)){
                    prepared_arr[ele.level].push(ele)
                }
            })

            callback({spells:data,known_spellist:known_arr,prepared_spellist:prepared_arr})
        })
    }

    function filterValidSpells(){
        SpelldataFetchHandler((data)=>{
            let all_spellnames = data.spells.map((ele)=>ele.name);
            let all_prepared_spellist = BdApi.getData('DnDPlugin','prepared_spellist')||{}
            let active_character = BdApi.getData('DnDPlugin','active_character')
            let new_prepared_spellist = {}
            Object.entries(all_prepared_spellist).forEach(([key,value])=>{
                if(value.character == active_character){
                    new_prepared_spellist[key] = {...value,spells:value.spells.filter(ele=>all_spellnames.includes(ele))} 
                }else{
                    new_prepared_spellist[key] = value
                }
            })
            let all_spellbook = BdApi.getData('DnDPlugin','spellbook')||{}
            all_spellbook[active_character] = (all_spellbook[active_character]||[]).filter(ele=>all_spellnames.includes(ele))
            BdApi.setData('DnDPlugin','prepared_spellist',new_prepared_spellist)
            BdApi.setData('DnDPlugin','spellbook',all_spellbook)
        })
    }

    function handleKeydown(e){
        keypress_recorder[e.keyCode] = true;
        var modal_keybind = [17,81]
        var modal_keybind_check = (modal_keybind.map(key_ele => keypress_recorder[key_ele]??false).find(key_ele => key_ele == false)) == undefined;
        if(modal_keybind_check && is_window_open_flag){
            DiscordModules.ModalActions.closeAllModals();
            is_window_open_flag = false;
        }else if(modal_keybind_check && !is_window_open_flag){
            createUI();
            is_window_open_flag = true;
        }
    }

    function handleKeyup(e){
        keypress_recorder[e.keyCode] = false;
    }

    return class DnDPlugin extends Plugin {
        onStart() {
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
            document.addEventListener('keydown',(e)=>handleKeydown(e),true)
            document.addEventListener('keyup',(e)=>handleKeyup(e),true)
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};