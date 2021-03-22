module.exports = {
  rules: {
    "no-underscore": {
      create: function (context) {
        return {
          FunctionExpression: function (node) {
            const functionNode = node.parent.key;
            const parentNode = functionNode.parent;
            if (!parentNode.accessibility || parentNode.accessibility !== 'private') return;

            const functionName = functionNode.name;
            if (functionNode.name[0] === '_') return;

            context.report({
              node,
              message: "{{ identifier }}: Private function require \"_\" prefix.",
              data: {
                identifier: functionName
              }
            });
          }
        };
      }
    },
    "no-handle-prefix": {
      create: function (context) {
        return {
          FunctionExpression: function (node) {
            const functionNode = node.parent.key;
            const parentNode = functionNode.parent;
            const functionName = functionNode.name;

            const noPrefixHandleFns = parentNode.value.params.filter(param => {
              const typeAnnotation = param.typeAnnotation.typeAnnotation;
              if (typeAnnotation.type !== 'TSTypeReference') return;
              if (typeAnnotation.typeName.name !== "Event") return;
              const noPrefix = functionName.indexOf('handle') === -1;

              return noPrefix;
            });

            if (noPrefixHandleFns.length === 0) return;

            noPrefixHandleFns.forEach(fn => {
              context.report({
                node,
                message: "{{ identifier }}: Event handler required \"handle\" prefix.",
                data: {
                  identifier: fn.parent.parent.key.name
                }
              });
            });
          }
        };
      }
    }
  }
};
