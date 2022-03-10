import * as React from 'react';
import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
} from '@expo/vector-icons';

const FontAwasome = ({ icon, size, color }) => {
	return (<FontAwesome name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Feathar = ({ icon, size, color }) => {
	return (<Feather name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const AntDesigne = ({ icon, size, color }) => {
	return (<AntDesign name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Entypoo = ({ icon, size, color }) => {
	return (<Entypo style={ { icon, size, color }.style } name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const FontAwasome5 = ({ icon, size, color }) => {
	return (<FontAwesome5 name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Fontistoo = ({ icon, size, color }) => {
	return (<Fontisto name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Foundations = ({ icon, size, color }) => {
	return (<Foundation name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Ioniconz = ({ icon, size, color }) => {
	return (<Ionicons name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Materiallconss = ({ icon, size, color }) => {
	return (<MaterialIcons name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const MaterialCommunityIconss = (props) => {
	return (<MaterialCommunityIcons name={ props.icon } size={ props.size || 30 } color={ props.color || '#900' } />);
};
const Octiconss = ({ icon, size, color }) => {
	return (<Octicons name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const Zociall = ({ icon, size, color }) => {
	return (<Zocial name={ icon } size={ size || 30 } color={ color || '#900' } />);
};
const SimpleLineIconss = ({ icon, size, color }) => {
	return (<SimpleLineIcons name={ icon } size={ size || 30 } color={ color || '#900' } />);
};

export {
	FontAwasome,
	Feathar,
	AntDesigne,
	Entypoo,
	// Evillcon,
	FontAwasome5,
	Fontistoo,
	Foundations,
	Ioniconz,
	Materiallconss,
	MaterialCommunityIconss,
	Octiconss,
	Zociall,
	SimpleLineIconss
};