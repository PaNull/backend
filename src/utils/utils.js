export const groupBy = (array, prop, propContent) => {
    const hash = array.reduce((p,c) => (p[c[prop]] ? p[c[prop]].push(c) : p[c[prop]] = [c],p) ,{});

    return Object.keys(hash).map(k => ({id: +k, [propContent]: hash[k]}));
}
